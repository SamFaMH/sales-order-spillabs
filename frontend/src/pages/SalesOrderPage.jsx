import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../redux/slices/customerSlice';
import { fetchItems } from '../redux/slices/itemSlice';
import { createOrder, updateOrder, fetchOrderById, clearSaveSuccess } from '../redux/slices/orderSlice';
import { calculateLineAmounts, calculateOrderTotals } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { Save, Printer, Trash2, Plus, ArrowLeft } from 'lucide-react';

const SalesOrderPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const { list: customers } = useSelector((state) => state.customers);
    const { list: items } = useSelector((state) => state.items);
    const { currentOrder, loading, saveSuccess } = useSelector((state) => state.orders);

    // Form state
    const [formData, setFormData] = useState({
        customerId: '',
        customerName: '',
        address1: '',
        address2: '',
        address3: '',
        suburb: '',
        state: '',
        postCode: '',
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        referenceNo: '',
        note: '',
        items: [],
    });

    // Load data on mount
    useEffect(() => {
        dispatch(fetchCustomers());
        dispatch(fetchItems());
        if (isEditMode) {
            dispatch(fetchOrderById(id));
        }
    }, [dispatch, id, isEditMode]);

    // Load order data when editing
    useEffect(() => {
        if (isEditMode && currentOrder) {
            const customer = customers.find(c => c.id === currentOrder.customerId);
            setFormData({
                customerId: currentOrder.customerId || '',
                customerName: currentOrder.customerName || '',
                address1: customer?.address1 || '',
                address2: customer?.address2 || '',
                address3: customer?.address3 || '',
                suburb: customer?.suburb || '',
                state: customer?.state || '',
                postCode: customer?.postCode || '',
                invoiceNo: currentOrder.invoiceNo || '',
                invoiceDate: currentOrder.invoiceDate || '',
                referenceNo: currentOrder.referenceNo || '',
                note: currentOrder.note || '',
                items: currentOrder.items || [],
            });
        }
    }, [currentOrder, isEditMode, customers]);

    // Navigate back on successful save
    useEffect(() => {
        if (saveSuccess) {
            dispatch(clearSaveSuccess());
            navigate('/');
        }
    }, [saveSuccess, navigate, dispatch]);

    // Handle customer selection
    const handleCustomerChange = (e) => {
        const customerId = e.target.value;
        const customer = customers.find(c => c.id === parseInt(customerId));

        if (customer) {
            setFormData({
                ...formData,
                customerId: customer.id,
                customerName: customer.name,
                address1: customer.address1 || '',
                address2: customer.address2 || '',
                address3: customer.address3 || '',
                suburb: customer.suburb || '',
                state: customer.state || '',
                postCode: customer.postCode || '',
            });
        } else {
            setFormData({
                ...formData,
                customerId: '',
                customerName: '',
                address1: '',
                address2: '',
                address3: '',
                suburb: '',
                state: '',
                postCode: '',
            });
        }
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // Add new item row
    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                {
                    itemId: '',
                    itemCode: '',
                    itemDescription: '',
                    note: '',
                    quantity: 0,
                    price: 0,
                    taxRate: 0,
                    exclAmount: 0,
                    taxAmount: 0,
                    inclAmount: 0,
                },
            ],
        });
    };

    // Remove item row
    const handleRemoveItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    // Handle item selection by code
    const handleItemCodeChange = (index, itemId) => {
        const item = items.find(i => i.id === parseInt(itemId));
        const newItems = [...formData.items];

        if (item) {
            newItems[index] = {
                ...newItems[index],
                itemId: item.id,
                itemCode: item.code,
                itemDescription: item.description,
                price: item.price,
            };

            // Recalculate amounts
            const amounts = calculateLineAmounts(
                newItems[index].quantity,
                item.price,
                newItems[index].taxRate
            );
            newItems[index] = { ...newItems[index], ...amounts };
        } else {
            newItems[index] = {
                ...newItems[index],
                itemId: '',
                itemCode: '',
                itemDescription: '',
                price: 0,
            };
        }

        setFormData({ ...formData, items: newItems });
    };

    // Handle item selection by description
    const handleItemDescriptionChange = (index, itemId) => {
        handleItemCodeChange(index, itemId);
    };

    // Handle item field changes
    const handleItemFieldChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        // Recalculate amounts if quantity or tax rate changed
        if (field === 'quantity' || field === 'taxRate') {
            const amounts = calculateLineAmounts(
                field === 'quantity' ? value : newItems[index].quantity,
                newItems[index].price,
                field === 'taxRate' ? value : newItems[index].taxRate
            );
            newItems[index] = { ...newItems[index], ...amounts };
        }

        setFormData({ ...formData, items: newItems });
    };

    // Calculate totals
    const totals = calculateOrderTotals(formData.items);

    // Handle save
    const handleSave = () => {
        const orderData = {
            customerId: formData.customerId,
            invoiceNo: formData.invoiceNo,
            invoiceDate: formData.invoiceDate,
            referenceNo: formData.referenceNo,
            note: formData.note,
            totalExcl: totals.totalExcl,
            totalTax: totals.totalTax,
            totalIncl: totals.totalIncl,
            items: formData.items.map(item => ({
                itemId: item.itemId,
                note: item.note,
                quantity: item.quantity,
                price: item.price,
                taxRate: item.taxRate,
                exclAmount: item.exclAmount,
                taxAmount: item.taxAmount,
                inclAmount: item.inclAmount,
            })),
        };

        if (isEditMode) {
            dispatch(updateOrder({ id, orderData }));
        } else {
            dispatch(createOrder(orderData));
        }
    };

    // Handle print
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#f3f1f6] px-4 py-6 sm:px-8 sm:py-10">
            <div className="mx-auto max-w-7xl">
                <div className="overflow-hidden rounded-3xl border border-[#efdae3] bg-[#fcfcff] shadow-[0_14px_30px_-22px_rgba(30,41,59,0.45)] [&_.label]:text-sm [&_.label]:font-medium [&_.label]:text-[#374b66] [&_.input-field]:rounded-lg [&_.input-field]:border-[#efbccd] [&_.input-field]:bg-[#fffefe] [&_.input-field]:text-[#263a5a] [&_.input-field]:focus:border-[#dca3bb] [&_.input-field]:focus:shadow-[0_0_0_3px_rgba(239,188,205,0.2)]">
                    <header className="bg-gradient-to-r from-[#f3d8e1] via-[#e8dbe9] to-[#c8d7ec] px-6 py-6 sm:px-8">
                        <h1 className="text-4xl font-semibold tracking-tight text-[#16335a]">
                            {isEditMode ? 'Edit Sales Order' : 'Sales Order'}
                        </h1>
                    </header>

                    <div className="space-y-7 px-6 py-8 sm:px-8">
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                onClick={handleSave}
                                variant="success"
                                disabled={loading}
                                className="rounded-xl border border-transparent bg-[#a9ecc6] px-5 py-2.5 text-base font-medium text-[#0f3a2a] hover:bg-[#90e1b3]"
                            >
                                <Save className="mr-2 inline-block h-4 w-4" />
                                {loading ? 'Saving...' : 'Save Order'}
                            </Button>
                            <Button
                                onClick={handlePrint}
                                variant="secondary"
                                className="rounded-xl border border-transparent bg-[#a9cff2] px-5 py-2.5 text-base font-medium text-[#1a3d66] hover:bg-[#95c2ea]"
                            >
                                <Printer className="mr-2 inline-block h-4 w-4" />
                                Print
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/')}
                                className="rounded-xl border border-transparent bg-[#d8e5f4] px-5 py-2.5 text-base font-medium text-[#1d3554] hover:bg-[#c5d8ee]"
                            >
                                <ArrowLeft className="mr-2 inline-block h-4 w-4" />
                                Back to Home
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Customer Section */}
                        <div className="space-y-4">
                            <h2 className="mb-4 text-lg font-semibold text-[#1c3d63]">Customer Information</h2>

                            <Select
                                label="Customer Name"
                                value={formData.customerId}
                                onChange={handleCustomerChange}
                                options={customers}
                                valueKey="id"
                                labelKey="name"
                                placeholder="Select Customer"
                            />

                            <Input
                                label="Address 1"
                                value={formData.address1}
                                onChange={(e) => handleInputChange('address1', e.target.value)}
                            />

                            <Input
                                label="Address 2"
                                value={formData.address2}
                                onChange={(e) => handleInputChange('address2', e.target.value)}
                            />

                            <Input
                                label="Address 3"
                                value={formData.address3}
                                onChange={(e) => handleInputChange('address3', e.target.value)}
                            />

                            <Input
                                label="Suburb"
                                value={formData.suburb}
                                onChange={(e) => handleInputChange('suburb', e.target.value)}
                            />

                            <Input
                                label="State"
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                            />

                            <Input
                                label="Post Code"
                                value={formData.postCode}
                                onChange={(e) => handleInputChange('postCode', e.target.value)}
                            />
                        </div>

                        {/* Order Details Section */}
                        <div className="space-y-4">
                            <h2 className="mb-4 text-lg font-semibold text-[#1c3d63]">Order Details</h2>

                            <Input
                                label="Invoice No"
                                value={formData.invoiceNo}
                                onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
                            />

                            <Input
                                label="Invoice Date"
                                type="date"
                                value={formData.invoiceDate}
                                onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                            />

                            <Input
                                label="Reference No"
                                value={formData.referenceNo}
                                onChange={(e) => handleInputChange('referenceNo', e.target.value)}
                            />

                            <div className="mb-4">
                                <label className="label">Note</label>
                                <textarea
                                    value={formData.note}
                                    onChange={(e) => handleInputChange('note', e.target.value)}
                                    className="input-field h-36 resize-none"
                                    placeholder="Enter notes..."
                                />
                            </div>
                        </div>
                        </div>

                        {/* Order Items Section */}
                        <div className="mt-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-[#1c3d63]">Line Items</h2>
                                <Button
                                    onClick={handleAddItem}
                                    variant="primary"
                                    className="rounded-xl bg-[#efc3d5] px-4 py-2 text-sm font-medium text-[#173455] hover:bg-[#e8b4ca]"
                                >
                                    <Plus className="mr-2 inline-block h-4 w-4" />
                                Add Item
                                </Button>
                            </div>

                            <div className="overflow-x-auto rounded-2xl border border-[#efccd8] bg-white">
                                <table className="min-w-full border-0">
                                    <thead className="bg-gradient-to-r from-[#f2d9e1] via-[#e8dcea] to-[#cdd9eb]">
                                    <tr>
                                        <th className="border-b border-[#efccd8] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#2a456a]">Item Code</th>
                                        <th className="border-b border-[#efccd8] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#2a456a]">Description</th>
                                        <th className="border-b border-[#efccd8] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#2a456a]">Note</th>
                                        <th className="border-b border-[#efccd8] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#2a456a]">Quantity</th>
                                        <th className="border-b border-[#efccd8] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#2a456a]">Price</th>
                                        <th className="border-b border-[#efccd8] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#2a456a]">Tax %</th>
                                        <th className="border-b border-[#efccd8] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#2a456a]">Excl Amount</th>
                                        <th className="border-b border-[#efccd8] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#2a456a]">Tax Amount</th>
                                        <th className="border-b border-[#efccd8] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#2a456a]">Incl Amount</th>
                                        <th className="border-b border-[#efccd8] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#2a456a]">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.items.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="px-4 py-10 text-center text-slate-500">
                                                No line items yet. Click "Add Item" to start.
                                            </td>
                                        </tr>
                                    ) : (
                                        formData.items.map((item, index) => (
                                            <tr key={index} className="border-b border-[#f4e4eb] transition-colors hover:bg-[#fbf7fa]">
                                                <td className="px-3 py-2">
                                                    <select
                                                        value={item.itemId}
                                                        onChange={(e) => handleItemCodeChange(index, e.target.value)}
                                                        className="w-full rounded-md border border-[#efbccd] px-2 py-1 text-sm focus:border-[#dca3bb] focus:outline-none"
                                                    >
                                                        <option value="">Select</option>
                                                        {items.map((i) => (
                                                            <option key={i.id} value={i.id}>
                                                                {i.code}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <select
                                                        value={item.itemId}
                                                        onChange={(e) => handleItemDescriptionChange(index, e.target.value)}
                                                        className="w-full rounded-md border border-[#efbccd] px-2 py-1 text-sm focus:border-[#dca3bb] focus:outline-none"
                                                    >
                                                        <option value="">Select</option>
                                                        {items.map((i) => (
                                                            <option key={i.id} value={i.id}>
                                                                {i.description}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="text"
                                                        value={item.note}
                                                        onChange={(e) => handleItemFieldChange(index, 'note', e.target.value)}
                                                        className="w-full rounded-md border border-[#efbccd] px-2 py-1 text-sm focus:border-[#dca3bb] focus:outline-none"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemFieldChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        className="w-20 rounded-md border border-[#efbccd] px-2 py-1 text-sm focus:border-[#dca3bb] focus:outline-none"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-sm font-medium text-[#304864]">{formatCurrency(item.price)}</td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        value={item.taxRate}
                                                        onChange={(e) => handleItemFieldChange(index, 'taxRate', parseFloat(e.target.value) || 0)}
                                                        className="w-16 rounded-md border border-[#efbccd] px-2 py-1 text-sm focus:border-[#dca3bb] focus:outline-none"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-sm font-medium text-[#304864]">{formatCurrency(item.exclAmount)}</td>
                                                <td className="px-3 py-2 text-sm font-medium text-[#304864]">{formatCurrency(item.taxAmount)}</td>
                                                <td className="px-3 py-2 text-sm font-semibold text-[#1e395b]">{formatCurrency(item.inclAmount)}</td>
                                                <td className="px-3 py-2">
                                                    <button
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="rounded-md p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Totals Section */}
                        <div className="mt-6 flex justify-end">
                            <div className="w-full max-w-sm space-y-3">
                                <div className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-[#f7fafc] px-4 py-3">
                                    <span className="font-medium text-[#32435a]">Total Excl</span>
                                    <span className="text-lg font-semibold text-[#1f3653]">{formatCurrency(totals.totalExcl)}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-[#f7fafc] px-4 py-3">
                                    <span className="font-medium text-[#32435a]">Total Tax</span>
                                    <span className="text-lg font-semibold text-[#1f3653]">{formatCurrency(totals.totalTax)}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-[#efbccd] bg-[#fdeef3] px-4 py-3">
                                    <span className="font-bold text-[#203958]">Total Incl</span>
                                    <span className="text-2xl font-bold text-[#122e52]">{formatCurrency(totals.totalIncl)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesOrderPage;
