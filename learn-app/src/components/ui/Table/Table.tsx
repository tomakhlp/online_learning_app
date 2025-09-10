import {JSX, useState} from "react";
import {
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
} from "@mui/material";

interface Column<T = any> {
    key: string;
    title: string;
    render?: (value: T) => JSX.Element;
}

interface TableProps {
    columns: Column[];
    data: Record<string, any>[];
    selectable?: boolean;
    onSelectionChange?: (selectedRows: Record<string, any>[]) => void;
    onAction?: (selectedRows: Record<string, any>[]) => void;
    renderAction?: (onAction: () => void) => JSX.Element;
}

function Table({ columns, data, selectable = false, onSelectionChange, onAction, renderAction }: TableProps) {
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const handleSelectionChange = (row: any) => {
        const isSelected = selectedRows.includes(row);
        const updatedSelection = isSelected
            ? selectedRows.filter((selectedRow) => selectedRow !== row)
            : [...selectedRows, row];

        setSelectedRows(updatedSelection);
        if (onSelectionChange) {
            onSelectionChange(updatedSelection);
        }
    };

    const handleAction = () => {
        if (onAction) {
            onAction(selectedRows);
            setSelectedRows([]);
        }
    };

    return (
        <div>
            <TableContainer
                component={Paper}
                sx={{
                    border: '1px solid var(--color-basic-100)',
                    boxShadow: "none",
                    borderRadius: '6px',
                    backgroundColor: "var(--color-bg)",
                    transition: 'background-color 0.3s ease, border-color 0.3s ease',
                }}
            >
                <MuiTable>
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: "var(--color-basic-200)",
                                transition: 'background-color 0.3s ease, border-color 0.3s ease',
                            }}
                        >
                            {selectable &&
                                <TableCell
                                    className="w-12"
                                    sx={{
                                        border: "none",
                                        transition: 'background-color 0.3s ease, border-color 0.3s ease',
                                    }}
                                >
                                </TableCell>}
                            {columns.map((column) => (
                                <TableCell
                                    key={column.key}
                                    sx={{
                                        border: "none",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        color: "var(--color-body-100)",
                                        transition: 'background-color 0.3s ease, border-color 0.3s ease',
                                    }}
                                >
                                    {column.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.map((row, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                className={'bg-bg hover:bg-basic-100 transition-colors'}
                            >
                                {selectable && (
                                    <TableCell
                                        sx={{
                                            borderBottom: "1px solid var(--color-basic-100)",
                                            transition: 'background-color 0.3s ease, border-color 0.3s ease',
                                        }}
                                    >
                                        <Checkbox
                                            checked={selectedRows.includes(row)}
                                            onChange={() => handleSelectionChange(row)}
                                            className="text-primary-100"
                                            sx={{
                                                p: 0,
                                                color: "var(--color-body-100)"
                                            }}
                                        />
                                    </TableCell>
                                )}

                                {columns.map((column) => (
                                    <TableCell
                                        key={column.key}
                                        sx={{
                                            borderBottom: '1px solid var(--color-basic-100)',
                                            color: "var(--color-body-100)",
                                            transition: 'background-color 0.3s ease, border-color 0.3s ease',
                                    }}
                                    >
                                        {column.render ? column.render(row[column.key]) : row[column.key]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </MuiTable>
            </TableContainer>

            {renderAction && renderAction(handleAction)}
        </div>
    );
}

export default Table;
