import { VNode } from 'vue';
import type { TableColumnCtx } from 'element-plus'

export interface TableData {
    name?: string,
    date?: string,
    address?: string,
    result?: number,
    amount?: number,
    state?: string,
    city?: string,
    zip?: string,
    hasChildren?: boolean,
    propsData?: TableData[]
}

export interface ColumnItem {
    prop?: string,
    label: string,
    width?: number | string,
    minWidth?: number,
    align?: string,
    type?: string,
    sortable?: boolean | string,
    resizable?: boolean,
    columnKey?: string,
    selectable?: () => boolean,
    index?: (index: number) => number,
    filterMethod?: (value: any, row: any, column: any) => void,
    formatter?: (row: any, column: any, cellValue: any, index: number) => VNode | string,
    sortMethod?: (a: TableData, b: TableData) => number,
    slots?: {
        default?: (a: SlotsItem) => VNode;
        header?: (a: SlotsItem) => VNode;
    };
    showOverflowTooltip?: boolean,
    fixed?: boolean | 'left' | 'right',
    children?: ColumnItem[],
    filters?: FilterItem[],
    sortBy?: (row: any, index: number) => string | string | string[],
    sortOrders?: ('ascending' | 'descending' | null)[],
    headerAlign?: 'left' | 'center' | 'right',
    filterPlacement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end',
    className?: string,
    labelClassName?: string,
    filterClassName?: string,
    reserveSelection?: boolean,
    filterMultiple?: boolean,
    filterValue?: string[],
}

export interface SlotsItem {
    index: number,
    row: TableData,
}

export interface FilterItem {
    text: string,
    value: string,
}

export interface SummaryMethodProps<T = TableData> {
    columns: TableColumnCtx<T>[]
    data: T[]
}

export interface SpanMethodProps {
    row: TableData
    column: TableColumnCtx<TableData>
    rowIndex: number
    columnIndex: number
}