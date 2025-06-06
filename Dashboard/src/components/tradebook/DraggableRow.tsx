import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Row } from '@tanstack/react-table';
import { TableCell, TableRow } from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';
import { Trade } from './TradeSchema';

interface DraggableRowProps {
  row: Row<Trade>;
}

export function DraggableRow({ row }: DraggableRowProps) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 transition-colors hover:bg-muted/40 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });
  
  return (
    <div
      {...attributes}
      {...listeners}
      className="flex h-7 w-7 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 active:cursor-grabbing"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-3.5"
      >
        <circle cx="9" cy="12" r="1" />
        <circle cx="9" cy="5" r="1" />
        <circle cx="9" cy="19" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="15" cy="5" r="1" />
        <circle cx="15" cy="19" r="1" />
      </svg>
      <span className="sr-only">Drag to reorder</span>
    </div>
  );
}