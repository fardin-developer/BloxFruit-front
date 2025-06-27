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

    
    const columns: TableColumn[] = [
        {key: "email", label: "Email", type: "text"},
        {key: "created_at", label: "Created At", type: "text"},
    ]

    return (
        <div>
            <DynamicTable columns={columns} data={subscribersData} loading={isLoading} />
        </div>
    );
};

export default Others;