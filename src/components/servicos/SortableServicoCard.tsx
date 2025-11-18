import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ServicoCard } from './ServicoCard';
import { GripVertical } from 'lucide-react';
import { Servico, Cliente, Categoria } from '@/types';

interface Props {
  servico: Servico;
  cliente: Cliente | undefined;
  categoria: Categoria | undefined;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const SortableServicoCard = ({ servico, ...props }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: servico.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div 
        className="absolute top-2 left-2 cursor-grab active:cursor-grabbing z-10 bg-background/80 rounded p-1 hover:bg-background"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <ServicoCard servico={servico} {...props} />
    </div>
  );
};
