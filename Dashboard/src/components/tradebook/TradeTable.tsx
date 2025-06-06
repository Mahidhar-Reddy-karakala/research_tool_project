import React, { useState, useMemo } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDownIcon,
  BarChart3Icon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TagIcon,
} from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { TradeDetailView } from './TradeDetailView';
import { DraggableRow, DragHandle } from './DraggableRow';
import { Trade, mockTrades, performanceData } from './TradeSchema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from 'recharts';
import { toast } from 'sonner';
import { format } from 'date-fns';

const columns: ColumnDef<Trade>[] = [
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'symbol',
    header: ({ column }) => (
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-3 h-8"
        >
          <span>Symbol</span>
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <TradeDetailView trade={row.original} />
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <Badge 
        variant="outline" 
        className={`${row.original.type === 'BUY' ? 'text-green-500 border-green-200' : 'text-red-500 border-red-200'}`}
      >
        {row.original.type === 'BUY' ? (
          <ArrowUpIcon className="mr-1 size-3" />
        ) : (
          <ArrowDownIcon className="mr-1 size-3" />
        )}
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const statusColors = {
        COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      };
      const status = row.original.status;
      return (
        <Badge 
          variant="secondary" 
          className={`font-medium ${statusColors[status]}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'quantity',
    header: () => <div className="text-right">Quantity</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.quantity}
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        ${row.original.price.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: 'pnl',
    header: () => <div className="text-right">P&L</div>,
    cell: ({ row }) => {
      const pnl = row.original.pnl;
      const isProfitable = pnl !== undefined && pnl > 0;
      
      if (pnl === undefined || row.original.status !== 'COMPLETED') {
        return <div className="text-right">—</div>;
      }
      
      return (
        <div className={`text-right font-medium ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
          {isProfitable ? '+' : ''}{pnl.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: 'timestamp',
    header: () => <div className="text-right">Date</div>,
    cell: ({ row }) => {
      try {
        const date = new Date(row.original.timestamp);
        return (
          <div className="text-right text-muted-foreground">
            {format(date, 'MMM dd, yyyy')}
          </div>
        );
      } catch (e) {
        return <div className="text-right">Invalid date</div>;
      }
    },
  },
  {
    accessorKey: 'plan',
    header: 'Plan',
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.original.plan}>
        {row.original.plan || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'execution',
    header: 'Execution',
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.original.execution}>
        {row.original.execution || '—'}
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => {
                toast.info(`Edit Trade ${row.original.symbol}`);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toast.info(`Duplicate Trade ${row.original.symbol}`);
              }}
            >
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                toast.info(`Delete Trade ${row.original.symbol}`);
              }}
              className="text-red-600 focus:text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TradeTable() {
  const [data, setData] = useState<Trade[]>(() => [...mockTrades]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const isMobile = useIsMobile();
  
  // Performance metrics
  const metrics = useMemo(() => {
    const completedTrades = data.filter(trade => trade.status === 'COMPLETED' && trade.pnl !== undefined);
    const profitableTrades = completedTrades.filter(trade => trade.pnl && trade.pnl > 0);
    const losingTrades = completedTrades.filter(trade => trade.pnl && trade.pnl < 0);
    
    const totalPnl = completedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const winRate = completedTrades.length ? (profitableTrades.length / completedTrades.length) * 100 : 0;
    
    return {
      totalTrades: completedTrades.length,
      profitableTrades: profitableTrades.length,
      losingTrades: losingTrades.length,
      totalPnl,
      winRate,
    };
  }, [data]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {})
  );
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  
  const dataIds = useMemo(() => data.map(({ id }) => id), [data]);
  
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(Number(active.id));
        const newIndex = dataIds.indexOf(Number(over.id));
        return arrayMove(data, oldIndex, newIndex);
      });
      
      toast.success("Trade order updated");
    }
  }
  
  React.useEffect(() => {
    if (searchQuery) {
      table.getColumn('symbol')?.setFilterValue(searchQuery);
    } else {
      table.getColumn('symbol')?.setFilterValue('');
    }
  }, [searchQuery, table]);
  
  return (
    <Tabs defaultValue="trades" className="w-full p-2">
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="trades" className="flex-1 md:flex-none">Trades</TabsTrigger>
            <TabsTrigger value="performance" className="flex-1 md:flex-none">Performance</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 md:flex-none">Analytics</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative w-full md:w-[200px] lg:w-[300px]">
              <Input
                placeholder="Search trades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <FilterIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto h-9 gap-1">
                  <TagIcon className="h-3.5 w-3.5" />
                  <span>Columns</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                {table
                  .getAllColumns()
                  .filter(column => column.getCanHide())
                  .map(column => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id === 'pnl' ? 'P&L' : column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button className="gap-1" size="sm">
              <PlusIcon className="h-3.5 w-3.5" />
              <span>New Trade</span>
            </Button>
          </div>
        </div>
        
        <TabsContent value="trades" className="m-0">
          <div className="rounded-md border">
            <DndContext
              sensors={sensors}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
            >
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No trades found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
          
          <div className="flex flex-col items-center justify-between gap-4 py-4 md:flex-row">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} trade(s) selected.
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value))
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="m-0 space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium text-muted-foreground">Total P&L</div>
              <div className={`mt-1 text-2xl font-semibold ${metrics.totalPnl > 0 ? 'text-green-500' : metrics.totalPnl < 0 ? 'text-red-500' : ''}`}>
                {metrics.totalPnl > 0 && '+'}${metrics.totalPnl.toFixed(2)}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium text-muted-foreground">Win Rate</div>
              <div className="mt-1 text-2xl font-semibold">
                {metrics.winRate.toFixed(1)}%
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium text-muted-foreground">Completed Trades</div>
              <div className="mt-1 text-2xl font-semibold">
                {metrics.totalTrades}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium text-muted-foreground">Profit / Loss Ratio</div>
              <div className="mt-1 text-2xl font-semibold">
                {metrics.profitableTrades}:{metrics.losingTrades}
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="mb-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Cumulative P&L</h3>
                <div className="flex items-center gap-2">
                  <Select defaultValue="30">
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent side="top">
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="365">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                  <BarChart3Icon className="size-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Performance over time</p>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={performanceData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'P&L']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cumulativePnL" 
                    stroke="#10b981" 
                    fillOpacity={1}
                    fill="url(#colorPnL)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="m-0 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Performance by Symbol</h3>
                <CalendarIcon className="size-4 text-muted-foreground" />
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
  data={[
    { symbol: 'AAPL', pnl: 22.3 },
    { symbol: 'MSFT', pnl: 75.6 },
    { symbol: 'NVDA', pnl: -77.25 },
    { symbol: 'GOOGL', pnl: 28.08 },
    { symbol: 'META', pnl: 248.99 },
    { symbol: 'COIN', pnl: -108.75 },
    { symbol: 'AMD', pnl: 108.75 },
  ]}
  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
>
  <CartesianGrid strokeDasharray="3 3" vertical={false} />
  <XAxis dataKey="symbol" />
  <YAxis tickFormatter={(value) => `$${value}`} />
  <Tooltip formatter={(value) => [`$${value}`, 'P&L']} />
  <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
    {[
      { symbol: 'AAPL', pnl: 22.3 },
      { symbol: 'MSFT', pnl: 75.6 },
      { symbol: 'NVDA', pnl: -77.25 },
      { symbol: 'GOOGL', pnl: 28.08 },
      { symbol: 'META', pnl: 248.99 },
      { symbol: 'COIN', pnl: -108.75 },
      { symbol: 'AMD', pnl: 108.75 },
    ].map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={entry.pnl >= 0 ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-3))'}
      />
    ))}
  </Bar>
</BarChart>

                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Win/Loss Distribution</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
                      <FilterIcon className="size-4" />
                      <span>Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem checked>
                      Buy Trades
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>
                      Sell Trades
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Market Orders
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>
                      Limit Orders
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Win', count: metrics.profitableTrades, fill: 'hsl(var(--chart-2))' },
                      { name: 'Loss', count: metrics.losingTrades, fill: 'hsl(var(--chart-5))' },
                    ]}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill={(entry) => entry.fill} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div> */}
              <div className="h-[300px] w-full">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={[
        { name: 'Win', count: metrics.profitableTrades, fill: 'hsl(var(--chart-2))' },
        { name: 'Loss', count: metrics.losingTrades, fill: 'hsl(var(--chart-5))' },
      ]}
      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
        {[
          { name: 'Win', count: metrics.profitableTrades, fill: 'hsl(var(--chart-2))' },
          { name: 'Loss', count: metrics.losingTrades, fill: 'hsl(var(--chart-5))' },
        ].map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}