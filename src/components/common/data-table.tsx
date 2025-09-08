import { ReactNode } from "react";
import { Card } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function DataTable({
    header,
    dataSource,
    isLoading
}: {
    header: string[],
    dataSource: (string | ReactNode)[][],
    isLoading?: boolean
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
                                            <div key={i} className="w-full h-8 bg-muted animate-pulse rounded-lg" />
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}