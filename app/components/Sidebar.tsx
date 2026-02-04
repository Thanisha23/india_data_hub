"use client";

import { useState } from "react";

type Categories = {
  [key: string]: Categories;
};

export default function Sidebar({ categories }: { categories: Categories }) {
  return (
    <div className="text-sm text-gray-800 pb-5">
      <CategoryNode data={categories} level={0} />
    </div>
  );
}

function CategoryNode({
  data,
  level,
}: {
  data: Categories;
  level: number;
}) {
  return (
    <ul>
      {Object.keys(data).map((key) => (
        <CategoryItem
          key={key}
          label={key}
          childrenData={data[key]}
          level={level}
        />
      ))}
    </ul>
  );
}

function CategoryItem({
  label,
  childrenData,
  level,
}: {
  label: string;
  childrenData: Categories;
  level: number;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = Object.keys(childrenData).length > 0;

  return (
    <li>
      <div
        onClick={() => hasChildren && setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer select-none
          hover:bg-white hover:font-semibold transition
        `}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {hasChildren ? (
          <img
            src="/down.png"
            alt="toggle"
            className={`w-4 h-4 transition-transform duration-200 ${
              open ? "rotate-0" : "-rotate-90"
            }`}
          />
        ) : (
          <span className="w-3 h-3" />
        )}

        <span className="truncate text-[18px]">{label}</span>
      </div>

      {hasChildren && open && (
        <CategoryNode data={childrenData} level={level + 1} />
      )}
    </li>
  );
}
