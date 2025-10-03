import { ReactNode } from "react";
import { Card } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import PaginationDataTable from "./pagination-datatable";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { LIMIT_LIST } from "@/constants/data-table-constant";

export default function DataTable({
    header,
    dataSource,
    isLoading,
    totalPages,
    currentPage,
    currentLimit,
    onPageChange,
    onLimitChange,
}: {
    header: string[]
    dataSource: (string | ReactNode)[][]
    isLoading?: boolean
    totalPages: number
    currentPage: number
    currentLimit: number
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
}) {
    return (
        <div className="w-full flex flex-col gap-4">
            <Card className="p-0">
                <Table className="w-full rounded-lg overflow-hidden">
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        <TableRow>
                            {header.map((column) => (
                                <TableHead key={`th-${column}`} className="px-6 py-3">
                                    {column}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataSource?.map((row, rowIndex) => {
                            const delayMs = rowIndex * 100
                            return (
                                <TableRow key={`tr-${rowIndex}`} className="hover:bg-muted/50 data-[state=selected]:bg-muted space-y-2">
                                    {row.map((cell, columnIndex) => (
                                        <TableCell key={`td-${columnIndex}`} className="px-6 py-3">
                                            <div className="slide-in-text-bottom" style={{
                                                ['--tw-enter-delay' as any]: `${delayMs}ms`,
                                                ['--tw-enter-duration' as any]: '200ms',
                                            }}>
                                                {cell}
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )
                        })}
                        {dataSource?.length === 0 && !isLoading && (
                            <TableRow>
                                <TableCell colSpan={header.length} className="h-24 text-center slide-in-text-bottom">
                                    No results Data.
                                </TableCell>
                            </TableRow>
                        )}
                        {isLoading && (
                            <TableRow className="hover:bg-muted/50 data-[state=selected]:bg-muted space-y-2">
                                <TableCell colSpan={header.length} className="h-24 text-center">
                                    <div className="flex flex-col gap-3">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="w-full h-8 bg-gray-300 dark:bg-muted animate-pulse rounded-lg" />
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Label>Limit</Label>
                    <Select value={currentLimit.toString()} defaultValue={currentLimit.toString()} onValueChange={(value) => onLimitChange(Number(value))}>
                        <SelectTrigger>
                            <SelectValue placeholder={'Select Limit'} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Limit</SelectLabel>
                                {LIMIT_LIST.map((limit) => (
                                    <SelectItem
                                        key={limit}
                                        value={limit.toString()}
                                    >
                                        {limit}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {
                    totalPages > 1 && (
                        <div className="flex justify-end">
                            <PaginationDataTable
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onChangePage={onPageChange}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}