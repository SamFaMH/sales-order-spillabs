import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/slices/orderSlice';
import Table from '../components/Table';
import Button from '../components/Button';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Plus } from 'lucide-react';

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { list: orders, loading } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const columns = [
        {
            header: 'Invoice No',
            accessor: 'invoiceNo',
        },
        {
            header: 'Customer Name',
            accessor: 'customerName',
        },
        {
            header: 'Invoice Date',
            accessor: 'invoiceDate',
            render: (row) => formatDate(row.invoiceDate),
        },
        {
            header: 'Reference No',
            accessor: 'referenceNo',
        },
        {
            header: 'Total Amount',
            accessor: 'totalIncl',
            render: (row) => formatCurrency(row.totalIncl),
        },
    ];

    const handleRowClick = (order) => {
        navigate(`/order/${order.id}`);
    };

    const handleAddNew = () => {
        navigate('/order');
    };

    return (
        <div className="min-h-screen bg-[#f3f1f6] px-4 py-6 sm:px-8 sm:py-10">
            <div className="mx-auto max-w-7xl">
                <section className="overflow-hidden rounded-3xl border border-[#efdae3] bg-[#fcfcff] shadow-[0_14px_30px_-22px_rgba(30,41,59,0.45)]">
                    <header className="bg-gradient-to-r from-[#f3d8e1] via-[#e8dbe9] to-[#c8d7ec] px-6 py-8 sm:px-10">
                        <h1 className="text-4xl font-semibold tracking-tight text-[#16335a]">Home</h1>
                    </header>

                    <div className="space-y-7 px-6 py-8 sm:px-10 sm:py-10">
                        <Button
                            onClick={handleAddNew}
                            variant="primary"
                            className="rounded-2xl bg-[#e8bfd4] px-8 py-4 text-xl font-semibold text-[#173455] shadow-none hover:bg-[#dfafc8]"
                        >
                            <Plus className="mr-3 inline-block h-6 w-6" />
                            Add New
                        </Button>

                        {loading ? (
                            <div className="rounded-2xl border border-[#f0cfdb] bg-white px-4 py-14 text-center">
                                <p className="text-lg text-slate-500">Loading orders...</p>
                            </div>
                        ) : (
                            orders.length === 0 ? (
                                <div className="overflow-hidden rounded-2xl border border-[#efccd8] bg-white">
                                    <table className="min-w-full">
                                        <thead className="bg-gradient-to-r from-[#f2d9e1] via-[#e8dcea] to-[#cdd9eb]">
                                            <tr>
                                                {columns.map((column) => (
                                                    <th
                                                        key={column.header}
                                                        className="border-b border-[#efccd8] px-8 py-5 text-left text-lg font-semibold text-[#243c60]"
                                                    >
                                                        {column.header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colSpan={columns.length} className="px-6 py-16 text-center text-xl text-slate-500">
                                                    No sales orders yet. Click "Add New" to create your first order.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="overflow-hidden rounded-2xl border border-[#efccd8] bg-white">
                                    <Table
                                        columns={columns}
                                        data={orders}
                                        onRowClick={handleRowClick}
                                        className="[&_table]:border-0 [&_table]:rounded-none [&_table]:shadow-none [&_thead]:bg-gradient-to-r [&_thead]:from-[#f2d9e1] [&_thead]:via-[#e8dcea] [&_thead]:to-[#cdd9eb] [&_th]:border-b [&_th]:border-[#efccd8] [&_th]:px-8 [&_th]:py-5 [&_th]:text-lg [&_th]:font-semibold [&_th]:text-[#243c60] [&_td]:px-8 [&_td]:py-5 [&_td]:text-base [&_td]:text-[#374c6a] [&_tbody_tr]:border-[#f4e4eb] [&_tbody_tr:hover]:bg-[#fbf7fa] [&_tbody_td:first-child]:font-medium"
                                    />
                                </div>
                            )
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
