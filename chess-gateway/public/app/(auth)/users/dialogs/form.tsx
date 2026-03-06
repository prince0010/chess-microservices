"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    useCreateUser,
    useFetchUser,
    useUpdateUser,
} from "@/modules/user/hooks";
import { UserSchema } from "@/modules/user/validation";
import { cn } from "@/lib/utils";
import { Roles } from "@/lib/enums";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";

const FormDialog = ({
    id,
    refetch,
    open: externalOpen,
    onOpenChange: externalOnOpenChange,
}: {
    id?: string;
    refetch?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) => {
    const [internalOpen, setInternalOpen] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();
    const { data } = useFetchUser(id || undefined);

    // Use external state if provided, otherwise use internal state
    const open = externalOpen !== undefined ? externalOpen : internalOpen;
    const setOpen = externalOnOpenChange || setInternalOpen;

    // Roles Options
    const roleOptions = Roles.map((r) => ({
        value: r,
        label: r.charAt(0).toUpperCase() + r.slice(1).toLowerCase(),
    }));
    const [openRoleOptions, setOpenRoleOptions] = useState<boolean>(false);

    // Mutations
    const [create] = useCreateUser();
    const [update] = useUpdateUser();

    const form = useForm<z.infer<typeof UserSchema>>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            role: "user",
            status: true,
            isActive: true,
        },
    });

    useEffect(() => {
        if (data) {
            const user = data?.fetchUser;
            form.reset({
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                username: user?.username || "",
                role: user?.role || "user",
                status: user?.status ?? true,
                isActive: user?.isActive ?? true,
            });
        }
    }, [data, form]);

    const onSubmit = (payload: z.infer<typeof UserSchema>) =>
        startTransition(async () => {
            try {
                if (id) {
                    await update({
                        variables: { input: { _id: id, ...payload } },
                    });
                    toast.success("User updated successfully");
                } else {
                    await create({
                        variables: { input: { ...payload, status: true, isActive: true } },
                    });
                    toast.success("User created successfully");
                }
                onClose();
                refetch?.();
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || "Something went wrong.");
            }
        });

    const onClose = () => {
        form.reset();
        setOpen(false);
    };

    return (
        <Dialog modal open={open} onOpenChange={setOpen}>
            {/* Only show DialogTrigger when not controlled externally AND has id */}
            {externalOpen === undefined && id ? (
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Edit
                    </DropdownMenuItem>
                </DialogTrigger>
            ) : externalOpen === undefined && !id ? (
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <PlusCircle />
                        Add User
                    </Button>
                </DialogTrigger>
            ) : null}

            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                showCloseButton={false}
            >
                <DialogHeader>
                    <DialogTitle>{id ? "Edit User" : "Add User"}</DialogTitle>
                    <DialogDescription>
                        Fields marked with * are required.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name *</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="First Name"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name *</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Last Name"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Username"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role *</FormLabel>
                                    <FormControl>
                                        <Popover
                                            open={openRoleOptions}
                                            onOpenChange={setOpenRoleOptions}
                                            modal
                                        >
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={`w-full flex items-center justify-between font-normal ${field.value ? "" : "text-muted-foreground"
                                                            }`}
                                                    >
                                                        {field.value
                                                            ? roleOptions.find((t) => t.value === field.value)
                                                                ?.label
                                                            : "Select role"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search roles..." />
                                                    <CommandList>
                                                        <CommandGroup heading="Roles">
                                                            {roleOptions.map((t) => (
                                                                <CommandItem
                                                                    value={t.label}
                                                                    key={t.value}
                                                                    onSelect={() => {
                                                                        field.onChange(t.value);
                                                                        setOpenRoleOptions(false);
                                                                    }}
                                                                >
                                                                    {t.label}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            field.value === t.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                    <CommandEmpty>No role found.</CommandEmpty>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isPending}
                                    type="button"
                                >
                                    Close
                                </Button>
                            </DialogClose>
                            <Button disabled={isPending} type="submit">
                                {id ? "Update" : "Create"} User
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default FormDialog;