"use client";

import rbiData from "@/data/response1.json";
import imfData from "@/data/response2.json";
import {
  Bookmark,
  ChartLine,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Menu,
  Pin,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import FrequentList from "../components/FrequentList";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

type FrequentItem = {
  id: string;
  title: string;
  cat?: string;
  subCat?: string;
  freq?: string;
  unit?: string;
  db?: string;
  src?: string;
  datatype?: string;
  hierarchy?: string[];
  subset?: string;
  sData?: string;
  table_name?: string;
  region?: string;
};


export default function CataloguePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dataset, setDataset] = useState<"RBI" | "IMF">("RBI");
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(
    new Set(),
  );
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());
  const [pinnedItems, setPinnedItems] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const [selectedFrequencies, setSelectedFrequencies] = useState<Set<string>>(
    new Set(),
  );
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );

  const data = dataset === "RBI" ? rbiData : imfData;
  const PAGE_SIZE = 10;

  const availableFrequencies = useMemo(() => {
    const frequencies = new Set<string>();
    data.frequent.forEach((item) => {
      if (item.freq) frequencies.add(item.freq);
    });
    return Array.from(frequencies).sort();
  }, [data.frequent]);

  const availableUnits = useMemo(() => {
    const units = new Set<string>();
    data.frequent.forEach((item) => {
      if (item.unit) units.add(item.unit);
    });
    return Array.from(units).sort();
  }, [data.frequent]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    data.frequent.forEach((item) => {
      if (item.cat) categories.add(item.cat);
    });
    return Array.from(categories).sort();
  }, [data.frequent]);

  const filteredItems = useMemo(() => {
    let items: FrequentItem[] = data.frequent as FrequentItem[];

    if (showBookmarks) {
      items = items.filter((item) => bookmarkedItems.has(item.id));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) => {
        return (
          item.title?.toLowerCase().includes(query) ||
          item.cat?.toLowerCase().includes(query) ||
          item.subCat?.toLowerCase().includes(query) ||
          item.freq?.toLowerCase().includes(query) ||
          item.unit?.toLowerCase().includes(query)
        );
      });
    }

    if (localSearchQuery.trim()) {
      const query = localSearchQuery.toLowerCase();
      items = items.filter((item) => {
        return (
          item.title?.toLowerCase().includes(query) ||
          item.cat?.toLowerCase().includes(query) ||
          item.subCat?.toLowerCase().includes(query) ||
          item.freq?.toLowerCase().includes(query) ||
          item.unit?.toLowerCase().includes(query)
        );
      });
    }

    if (selectedFrequencies.size > 0) {
      items = items.filter((item) =>
        item.freq ? selectedFrequencies.has(item.freq) : false
      );
    }

    if (selectedUnits.size > 0) {
      items = items.filter((item) =>
        item.unit ? selectedUnits.has(item.unit) : false
      );
    }

    if (selectedCategories.size > 0) {
      items = items.filter((item) =>
        item.cat ? selectedCategories.has(item.cat) : false
      );
    }

    return items;
  }, [
    data.frequent,
    searchQuery,
    localSearchQuery,
    showBookmarks,
    bookmarkedItems,
    selectedFrequencies,
    selectedUnits,
    selectedCategories,
  ]);
  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, page]);

  const toggleFilter = (
    filterSet: Set<string>,
    setFilterSet: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string,
  ) => {
    setFilterSet((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSelectedFrequencies(new Set());
    setSelectedUnits(new Set());
    setSelectedCategories(new Set());
    setLocalSearchQuery("");
  };

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleCart = (id: string) => {
    setCartItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const togglePin = (id: string) => {
    setPinnedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    setPage(1);
  }, [
    dataset,
    searchQuery,
    localSearchQuery,
    showBookmarks,
    selectedFrequencies,
    selectedUnits,
    selectedCategories,
  ]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const activeFiltersCount =
    selectedFrequencies.size + selectedUnits.size + selectedCategories.size;

  return (
    <div className="h-screen flex flex-col overflow-hidden font-inter">
      <div className="flex-none">
        <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 md:px-6 font-inter pt-3 flex-none">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-3 gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ChevronLeft
                  size={20}
                  className="md:hidden cursor-pointer"
                  onClick={() => router.back()}
                />
                <ChevronLeft
                  size={23}
                  className="hidden md:block cursor-pointer"
                  onClick={() => router.back()}
                />
                <h1 className="text-xl md:text-2xl font-semibold">
                  Economic Monitor
                </h1>
              </div>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 border border-gray-300 rounded-md"
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="hidden md:flex justify-center gap-3 flex-wrap">
              <div className="flex justify-center items-center gap-3 px-4 border-r border-r-gray-300">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 border rounded-md transition-colors ${
                    showFilters
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-300 hover:border-primary"
                  }`}
                >
                  <Search size={20} />
                </button>
                <button
                  onClick={() => setShowBookmarks(!showBookmarks)}
                  className={`p-2 border rounded-md transition-colors ${
                    showBookmarks
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-300 hover:border-primary"
                  }`}
                >
                  <Bookmark
                    size={20}
                    fill={showBookmarks ? "currentColor" : "none"}
                  />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 border rounded-md transition-colors ${
                      showFilters || activeFiltersCount > 0
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    <Filter size={20} />
                  </button>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
              </div>

              {selectedItems.size > 0 && (
                <div className="flex justify-center items-center">
                  <span className="text-gray-600 text-sm">Selected</span>
                  <span className="font-semibold px-2 text-sm">
                    ({selectedItems.size})
                  </span>
                </div>
              )}

              <div className="flex justify-center items-center gap-3 px-4">
                <button className="p-2 border border-gray-300 rounded-md hover:border-primary transition-colors relative">
                  <ShoppingCart size={20} className="text-gray-500" />
                  {cartItems.size > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.size}
                    </span>
                  )}
                </button>
                <button className="p-2 border border-gray-300 rounded-md hover:border-primary transition-colors relative">
                  <Pin size={20} className="text-gray-500" />
                  {pinnedItems.size > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pinnedItems.size}
                    </span>
                  )}
                </button>
              </div>

              <button
                disabled={selectedItems.size === 0}
                className="px-4 rounded-md py-1 flex justify-center items-center gap-2 text-white bg-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                <ChartLine size={18} />
                <h3>View Graph</h3>
              </button>
            </div>
          </div>

          <div className="md:hidden flex gap-2 mb-3 overflow-x-auto pb-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-md text-sm whitespace-nowrap ${
                showFilters
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-300"
              }`}
            >
              <Search size={16} />
              <span>Search</span>
            </button>
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-md text-sm whitespace-nowrap ${
                showBookmarks
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-300"
              }`}
            >
              <Bookmark
                size={16}
                fill={showBookmarks ? "currentColor" : "none"}
              />
              <span>Saved ({bookmarkedItems.size})</span>
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-md text-sm whitespace-nowrap relative ${
                showFilters || activeFiltersCount > 0
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-300"
              }`}
            >
              <Filter size={16} />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {selectedItems.size > 0 && (
              <button className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-md text-sm whitespace-nowrap">
                <ChartLine size={16} />
                <span>Graph ({selectedItems.size})</span>
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mb-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Filter size={20} />
                  Filters & Search
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Items
                  </label>
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={localSearchQuery}
                      onChange={(e) => setLocalSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency ({selectedFrequencies.size} selected)
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-2 bg-white p-2 rounded border border-gray-300">
                    {availableFrequencies.map((freq) => (
                      <label
                        key={freq}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFrequencies.has(freq)}
                          onChange={() =>
                            toggleFilter(
                              selectedFrequencies,
                              setSelectedFrequencies,
                              freq,
                            )
                          }
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{freq}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit ({selectedUnits.size} selected)
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-2 bg-white p-2 rounded border border-gray-300">
                    {availableUnits.map((unit) => (
                      <label
                        key={unit}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUnits.has(unit)}
                          onChange={() =>
                            toggleFilter(selectedUnits, setSelectedUnits, unit)
                          }
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{unit}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category ({selectedCategories.size} selected)
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-2 bg-white p-2 rounded border border-gray-300">
                    {availableCategories.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.has(cat)}
                          onChange={() =>
                            toggleFilter(
                              selectedCategories,
                              setSelectedCategories,
                              cat,
                            )
                          }
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex overflow-hidden px-4 md:px-6 pb-6">
          <div
            className={`
              fixed inset-0 bg-black/50 z-50 md:hidden
              transition-opacity duration-300
              ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className={`
                fixed left-0 top-0 h-full w-70 bg-white
                transform transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                overflow-y-auto
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100"
              >
                <X size={20} />
              </button>

              <div className="p-4">
                <div className="bg-blue-100 rounded-xl px-4 py-3 mb-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Category:
                  </label>
                  <div className="relative">
                    <select
                      value={dataset}
                      onChange={(e) => {
                        setDataset(e.target.value as "RBI" | "IMF");
                        setIsOpen(false);
                        setSidebarOpen(false);
                      }}
                      onFocus={() => setIsOpen(true)}
                      onBlur={() => setIsOpen(false)}
                      className="w-full bg-transparent font-semibold text-lg appearance-none focus:outline-none cursor-pointer"
                    >
                      <option value="RBI">India & States</option>
                      <option value="IMF">IMF</option>
                    </select>
                    <span
                      className={`absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none transition-transform duration-200 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <ChevronDown size={26} />
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <Sidebar categories={data.categories} />
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-70 lg:w-[320px] flex-none mr-4">
            <div className="h-full flex flex-col">
              <div className="bg-blue-100 rounded-xl px-4 py-3 mb-2 flex-none">
                <label className="block text-xs text-gray-600 mb-1">
                  Category:
                </label>
                <div className="relative">
                  <select
                    value={dataset}
                    onChange={(e) => {
                      setDataset(e.target.value as "RBI" | "IMF");
                      setIsOpen(false);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setIsOpen(false)}
                    className="w-full bg-transparent font-semibold text-lg appearance-none focus:outline-none cursor-pointer"
                  >
                    <option value="RBI">India & States</option>
                    <option value="IMF">IMF</option>
                  </select>
                  <span
                    className={`absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <ChevronDown size={26} />
                  </span>
                </div>
              </div>

              <div className="flex-1 p-4 bg-blue-50 rounded-lg overflow-y-auto thin-scrollbar">
                <Sidebar categories={data.categories} />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="flex-none mb-3 flex justify-between items-center">
              <h2 className="font-bold text-lg">
                {showBookmarks ? "Bookmarked Items" : null}
              </h2>
              <p className="text-xs md:text-sm text-gray-600">
                {filteredItems.length} result(s)
                {(searchQuery || localSearchQuery || activeFiltersCount > 0) &&
                  " (filtered)"}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto thin-scrollbar">
              {paginatedItems.length > 0 ? (
                <FrequentList
                  items={paginatedItems}
                  selectedItems={selectedItems}
                  bookmarkedItems={bookmarkedItems}
                  cartItems={cartItems}
                  pinnedItems={pinnedItems}
                  onToggleSelection={toggleSelection}
                  onToggleBookmark={toggleBookmark}
                  onToggleCart={toggleCart}
                  onTogglePin={togglePin}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Search size={48} className="mb-4" />
                  <p className="text-lg">
                    {showBookmarks
                      ? "No bookmarked items"
                      : searchQuery || localSearchQuery
                        ? "No results found"
                        : "No items found"}
                  </p>
                  <p className="text-sm mt-2">
                    {showBookmarks
                      ? "Start bookmarking items to see them here"
                      : activeFiltersCount > 0
                        ? "Try adjusting your filters"
                        : "Try adjusting your search terms"}
                  </p>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {filteredItems.length > 0 && (
              <div className="flex-none flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 
                           bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                           transition-colors duration-200"
                >
                  <ChevronLeft size={18} />
                  <span className="font-medium">Previous</span>
                </button>

                <div className="hidden sm:flex items-center gap-2">
                  {page > 3 && (
                    <>
                      <button
                        onClick={() => setPage(1)}
                        className="w-10 h-10 rounded-lg font-medium transition-colors duration-200 bg-white border border-gray-300 hover:bg-gray-50"
                      >
                        1
                      </button>
                      {page > 4 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                    </>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((num) => num >= page - 2 && num <= page + 2)
                    .map((num) => (
                      <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors duration-200
                          ${
                            page === num
                              ? "bg-primary text-white"
                              : "bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        {num}
                      </button>
                    ))}

                  {page < totalPages - 2 && (
                    <>
                      {page < totalPages - 3 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setPage(totalPages)}
                        className="w-10 h-10 rounded-lg font-medium transition-colors duration-200 bg-white border border-gray-300 hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <div className="sm:hidden text-sm text-gray-600">
                  Page {page} of {totalPages}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 
                           bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                           transition-colors duration-200"
                >
                  <span className="font-medium">Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
