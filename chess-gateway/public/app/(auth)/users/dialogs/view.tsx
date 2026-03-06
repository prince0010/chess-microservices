"use client";

import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchUser } from "@/modules/user/hooks";
import { format } from "date-fns";
import RoleBadge from "@/components/role-badge";

type Props = {
    _id?: string;
    row?: boolean;
    rowSettings?: {
        clearId: () => void;
        open: boolean;
        onOpenChange: (open: boolean) => void;
    };
    label?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export default function ViewDialog(props: Props) {
    const [open, setOpen] = useState(false);

    // Use the SAME pattern as Product Type ViewDialog
    const isOpen = props.row ? props.rowSettings?.open || false :
        props.open !== undefined ? props.open : open;

    const setIsOpen = (value: boolean) => {
        if (props.row) {
            props.rowSettings?.onOpenChange(value);
        } else if (props.onOpenChange) {
            props.onOpenChange(value);
        } else {
            setOpen(value);
        }
    };

    const { data } = useFetchUser(props._id);
    const user = data?.fetchUser;

    const onClose = () => {
        if (props.row) {
            props.rowSettings?.clearId();
            props.rowSettings?.onOpenChange(false);
        } else {
            setIsOpen(false);
        }
    };

    // const accent = "#055c7a";

    return (
        <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
            {/* Only show DialogTrigger when NOT a row view AND not controlled externally */}
            {!props.row && props.open === undefined ? (
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        {props.label || "View"}
                    </DropdownMenuItem>
                </DialogTrigger>
            ) : null}

            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                showCloseButton={false}
                className="max-w-3xl rounded-2xl shadow-xl"
            >
                <DialogHeader className="space-y-2">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl text-neutral-700 font-semibold flex items-center gap-2">
                            {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : "View User"}
                            <Badge
                                variant="outline"
                                className={`text-xs border ${user?.isActive
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "opacity-70 text-red-500 border border-red-500 bg-red-500/10"
                                    }`}
                            >
                                {user?.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </DialogTitle>
                        {user?.role && <RoleBadge type={user.role} />}
                    </div>
                    <DialogDescription className="text-sm text-neutral-400">
                        User details and account information
                    </DialogDescription>
                </DialogHeader>

                <Card className="mt-3 shadow-sm">
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6 max-h-[28rem] overflow-y-auto">
                            {/* Row 1 - Basic Info */}
                            <div className="flex flex-col gap-1">
                                <Label className="text-sm font-medium text-neutral-400">
                                    First Name
                                </Label>
                                <span className="text-sm text-neutral-700 font-semibold">
                                    {user?.firstName || "-"}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label className="text-sm font-medium text-neutral-400">
                                    Last Name
                                </Label>
                                <span className="text-sm text-neutral-700 font-semibold">
                                    {user?.lastName || "-"}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label className="text-sm font-medium text-neutral-400">
                                    Username
                                </Label>

                                {user?.username && (
                                    <span className="text-sm underline underline-offset-2 text-neutral-700 font-semibold">
                                        {user.username}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label className="text-sm font-medium text-neutral-400">
                                    Role
                                </Label>
                                {user?.role ? (
                                    <RoleBadge type={user.role} />
                                ) : (
                                    <span className="text-sm text-neutral-700 font-semibold">
                                        -
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label className="text-sm  font-medium text-neutral-400">
                                    Email
                                </Label>
                                {user?.email && (
                                    <span className="text-sm underline underline-offset-2 text-neutral-700 font-semibold">
                                        {user.email}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label className="text-sm font-medium text-neutral-400">
                                    Account Status
                                </Label>
                                <Badge
                                    variant="outline"
                                    className={`w-fit border ${user?.status
                                        ? "border-green-500 bg-green-500 text-white"
                                        : "border-red-500 bg-red-500/10 text-red-500"
                                        }`}
                                >
                                    {user?.status ? "Active" : "Inactive"}
                                </Badge>
                            </div>

                            {/* <div className="flex flex-col gap-1">
                                <Label className="text-sm font-medium text-neutral-400">
                                    Active Status
                                </Label>
                                <Badge
                                    variant="outline"
                                    className={`w-fit border ${user?.isActive
                                        ? "border-green-500 bg-green-500 text-white"
                                        : "border-red-500 bg-red-500/10 text-red-500"
                                        }`}
                                >
                                    {user?.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div> */}

                            {/* Row 4 - Timestamps */}
                            <div className="grid grid-cols-2 gap-6 col-span-2 border-t border-neutral-200 pt-3">
                                {user?.createdAt && (
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-sm font-medium text-neutral-400">
                                            Created At
                                        </Label>
                                        <span className="text-sm text-neutral-700 font-semibold">
                                            {format(new Date(user.createdAt), "PP")}
                                        </span>
                                    </div>
                                )}

                                {user?.updatedAt && (
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-sm font-medium text-neutral-400">
                                            Updated At
                                        </Label>
                                        <span className="text-sm text-neutral-700 font-semibold">
                                            {format(new Date(user.updatedAt), "PP")}
                                        </span>
                                    </div>
                                )}
                            </div>

                        </div>
                    </CardContent>
                </Card>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            className="border border-neutral-700 bg-neutral-950 text-white cursor-pointer"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}