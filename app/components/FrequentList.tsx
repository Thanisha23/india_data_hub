"use client";

import { Bookmark, Plus, Pin, MoreVertical } from "lucide-react";

type FrequentItem = {
  id: string;
  title: string;
  cat?: string;
  subCat?: string;
  freq?: string;
  unit?: string;
};

interface FrequentListProps {
  items: FrequentItem[];
  selectedItems: Set<string>;
  bookmarkedItems: Set<string>;
  cartItems: Set<string>;
  pinnedItems: Set<string>;
  onToggleSelection: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onToggleCart: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export default function FrequentList({
  items,
  selectedItems,
  bookmarkedItems,
  cartItems,
  pinnedItems,
  onToggleSelection,
  onToggleBookmark,
  onToggleCart,
  onTogglePin,
}: FrequentListProps) {
  return (
    <div className="bg-white rounded-lg h-full flex flex-col">
      <div
        className="hidden md:grid md:grid-cols-[2.5fr_1.2fr_0.6fr_0.8fr]
                   px-4 py-4 text-base lg:text-lg font-semibold text-indigo-900
                   bg-[#f7f7f7] rounded-t-lg flex-none sticky top-0 z-10"
      >
        <div>Title</div>
        <div>Frequency</div>
        <div>Unit</div>
        <div>Actions</div>
      </div>

      <div className="hidden md:block flex-1 overflow-y-auto">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`grid grid-cols-[2.5fr_1.2fr_0.6fr_0.8fr]
                        px-4 py-4 text-sm border-b border-b-gray-300
                        ${idx % 2 === 0 ? "bg-blue-50/40" : "bg-white"}
                        ${selectedItems.has(item.id) ? "ring-2 ring-primary" : ""}
                        hover:bg-blue-50 cursor-pointer transition-all`}
            onClick={() => onToggleSelection(item.id)}
          >
            <div>
              <p className="font-semibold text-base lg:text-lg text-gray-900 leading-snug w-[90%]">
                {item.title}
              </p>

              {(item.cat || item.subCat) && (
                <p className="text-xs text-blue-600 mt-1">
                  {item.cat}
                  {item.subCat && ` / ${item.subCat}`}
                </p>
              )}
            </div>

            <div className="text-gray-800 text-sm lg:text-base flex items-center">
              {item.freq ?? "-"}
            </div>

            <div className="text-gray-800 text-sm lg:text-base flex items-center">
              {item.unit ?? "-"}
            </div>

            <div
              className="flex items-center gap-2 lg:gap-3 text-gray-500"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onToggleBookmark(item.id)}
                className={`transition-colors ${
                  bookmarkedItems.has(item.id)
                    ? "text-primary"
                    : "hover:text-primary"
                }`}
                title="Bookmark"
              >
                <Bookmark
                  size={18}
                  fill={bookmarkedItems.has(item.id) ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={() => onToggleCart(item.id)}
                className={`transition-colors ${
                  cartItems.has(item.id) ? "text-primary" : "hover:text-primary"
                }`}
                title="Add to cart"
              >
                <Plus size={18} />
              </button>
              <button
                onClick={() => onTogglePin(item.id)}
                className={`transition-colors ${
                  pinnedItems.has(item.id) ? "text-primary" : "hover:text-primary"
                }`}
                title="Pin"
              >
                <Pin
                  size={18}
                  fill={pinnedItems.has(item.id) ? "currentColor" : "none"}
                />
              </button>
              <button className="hover:text-primary cursor-pointer" title="More options">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="md:hidden space-y-3 overflow-y-auto flex-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
              selectedItems.has(item.id)
                ? "ring-2 ring-primary border-primary"
                : "border-gray-200"
            }`}
            onClick={() => onToggleSelection(item.id)}
          >
            <h3 className="font-semibold text-base text-gray-900 mb-2">
              {item.title}
            </h3>

            {(item.cat || item.subCat) && (
              <p className="text-xs text-blue-600 mb-3">
                {item.cat}
                {item.subCat && ` / ${item.subCat}`}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div>
                <span className="text-gray-500 text-xs">Frequency:</span>
                <p className="text-gray-800 font-medium">{item.freq ?? "-"}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Unit:</span>
                <p className="text-gray-800 font-medium">{item.unit ?? "-"}</p>
              </div>
            </div>

            <div
              className="flex justify-end gap-4 pt-3 border-t border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onToggleBookmark(item.id)}
                className={`transition-colors ${
                  bookmarkedItems.has(item.id)
                    ? "text-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
                title="Bookmark"
              >
                <Bookmark
                  size={20}
                  fill={bookmarkedItems.has(item.id) ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={() => onToggleCart(item.id)}
                className={`transition-colors ${
                  cartItems.has(item.id)
                    ? "text-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
                title="Add to cart"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={() => onTogglePin(item.id)}
                className={`transition-colors ${
                  pinnedItems.has(item.id)
                    ? "text-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
                title="Pin"
              >
                <Pin
                  size={20}
                  fill={pinnedItems.has(item.id) ? "currentColor" : "none"}
                />
              </button>
              <button className="text-gray-500 hover:text-primary" title="More options">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}