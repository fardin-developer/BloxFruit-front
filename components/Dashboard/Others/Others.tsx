"use client"
import { useGetSubscribersQuery } from '@/app/store/api/services/emailSubscriptionApi';
import DynamicTable, { TableColumn } from '@/components/ui/DynamicTable/DynamicTable';
import React from 'react';

const Others = () => {
    const {data:subscribers, isLoading} = useGetSubscribersQuery(null);
    console.log(subscribers);

    const subscribersData =  subscribers?.data?.map((subscriber:any) => ({
        email: subscriber.email,
        created_at: new Date(subscriber.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }),
    }));

    const downloadCSV = () => {
        if (!subscribersData || subscribersData.length === 0) {
            alert('No data to download');
            return;
        }

        // Create CSV content
        const headers = ['Email', 'Joined On'];
        const csvContent = [
            headers.join(','),
            ...subscribersData.map((subscriber: { email: string; created_at: string }) => 
                `"${subscriber.email}","${subscriber.created_at}"`
            )
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `email-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const columns: TableColumn[] = [
        {key: "email", label: "Email", type: "text"},
        {key: "created_at", label: "Joined On", type: "text"},
    ]

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl">Email Subscribers</h2>
                <button
                    onClick={downloadCSV}
                    disabled={isLoading || !subscribersData || subscribersData.length === 0}
                    className="bg-yellow-400 hover:bg-yellow-400 disabled:bg-gray-400 text-black px-4 py-2 flex items-center gap-2 transition-colors cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download CSV
                </button>
            </div>
            <DynamicTable columns={columns} data={subscribersData} loading={isLoading} />
        </div>
    );
};

export default Others;