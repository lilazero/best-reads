"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, List, Check } from "lucide-react";
import { toast } from "sonner";
import type { UserReadingList } from "@/lib/types";

interface AddToListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  bookTitle: string;
}

export default function AddToListDialog({
  open,
  onOpenChange,
  bookId,
  bookTitle,
}: AddToListDialogProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [lists, setLists] = useState<UserReadingList[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);

  // Form state
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [newListIsPublic, setNewListIsPublic] = useState(false);

  // Fetch user's reading lists
  const fetchLists = async () => {
    if (!isSignedIn) return;

    setLoading(true);
    try {
      const response = await fetch("/api/reading-lists");
      if (!response.ok) {
        throw new Error("Failed to fetch lists");
      }
      const data = await response.json();
      setLists(data.lists || []);
    } catch (error) {
      console.error("Error fetching lists:", error);
      toast.error("Failed to load your reading lists");
    } finally {
      setLoading(false);
    }
  };

  // Fetch lists when dialog opens
  useEffect(() => {
    if (open && isSignedIn) {
      fetchLists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isSignedIn]);

  // Create a new reading list
  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newListName.trim()) {
      toast.error("Please enter a list name");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/reading-lists/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newListName.trim(),
          description: newListDescription.trim() || undefined,
          isPublic: newListIsPublic,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create list");
      }

      toast.success("Reading list created!");
      setLists([...lists, data.list]);
      setShowCreateForm(false);
      setNewListName("");
      setNewListDescription("");
      setNewListIsPublic(false);

      // Automatically add the book to the new list
      await handleAddToList(data.list.id);
    } catch (error) {
      console.error("Error creating list:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create reading list"
      );
    } finally {
      setCreating(false);
    }
  };

  // Add book to a reading list
  const handleAddToList = async (listId: string) => {
    setAdding(listId);
    try {
      const response = await fetch("/api/reading-lists/add-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listId,
          bookId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add book to list");
      }

      toast.success(`"${bookTitle}" added to your list!`);

      // Update the local state with the updated list
      setLists(lists.map((list) => (list.id === listId ? data.list : list)));

      // Close dialog after successful addition
      setTimeout(() => {
        onOpenChange(false);
      }, 500);
    } catch (error) {
      console.error("Error adding book to list:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add book to list"
      );
    } finally {
      setAdding(null);
    }
  };

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add to Reading List</DialogTitle>
          <DialogDescription>
            Choose a list or create a new one for &quot;{bookTitle}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : lists.length === 0 && !showCreateForm ? (
            // Empty state
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-muted p-3">
                  <List className="size-6 text-muted-foreground" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">No reading lists yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first reading list to organize your books
                </p>
              </div>
              <Button onClick={() => setShowCreateForm(true)} className="mt-4">
                <Plus className="size-4 mr-2" />
                Create Your First List
              </Button>
            </div>
          ) : showCreateForm ? (
            // Create new list form
            <form onSubmit={handleCreateList} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="list-name">List Name *</Label>
                <Input
                  id="list-name"
                  placeholder="e.g., Summer Reads, Want to Read"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  maxLength={100}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="list-description">Description (optional)</Label>
                <Input
                  id="list-description"
                  placeholder="Describe your reading list"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  maxLength={500}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="list-public"
                  checked={newListIsPublic}
                  onChange={(e) => setNewListIsPublic(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label
                  htmlFor="list-public"
                  className="font-normal cursor-pointer"
                >
                  Make this list public
                </Label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewListName("");
                    setNewListDescription("");
                    setNewListIsPublic(false);
                  }}
                  disabled={creating}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating || !newListName.trim()}
                  className="flex-1"
                >
                  {creating ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="size-4 mr-2" />
                      Create & Add Book
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            // List selection
            <>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {lists.map((list) => {
                  const hasBook = list.bookIds.includes(bookId);
                  return (
                    <button
                      key={list.id}
                      onClick={() => !hasBook && handleAddToList(list.id)}
                      disabled={adding === list.id || hasBook}
                      className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{list.name}</div>
                        {list.description && (
                          <div className="text-sm text-muted-foreground truncate">
                            {list.description}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          {list.bookIds.length}{" "}
                          {list.bookIds.length === 1 ? "book" : "books"}
                        </div>
                      </div>
                      {adding === list.id ? (
                        <Loader2 className="size-4 animate-spin ml-2 shrink-0" />
                      ) : hasBook ? (
                        <Check className="size-4 ml-2 shrink-0 text-green-600" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={() => setShowCreateForm(true)}
                variant="outline"
                className="w-full"
              >
                <Plus className="size-4 mr-2" />
                Create New List
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
