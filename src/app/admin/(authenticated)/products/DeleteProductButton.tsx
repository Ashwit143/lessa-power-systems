"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteProductAction } from "../../actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${name}"?\nThis action cannot be undone.`)) {
      setIsDeleting(true);
      try {
        const result = await deleteProductAction(id);
        if (!result.success) {
          alert(`Failed to delete product: ${result.error}`);
        }
      } catch (err: any) {
        alert(`An error occurred: ${err.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete Product"
      className={`p-1.5 text-neutral-400 hover:text-error transition-colors rounded ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
