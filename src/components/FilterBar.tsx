import React from "react";
import { SortBy } from "../types/pokemonTypes";
import "../styles/FilterBar.scss";

const TYPES = [
  'normal','fire','water','electric','grass','ice',
  'fighting','poison','ground','flying','psychic',
  'bug','rock','ghost','dragon','dark','steel','fairy',
];

const TYPE_COLORS: Record<string, string> = {
  fire:     '#FF4500',
  water:    '#1E90FF',
  grass:    '#2ECC40',
  electric: '#FFD700',
  psychic:  '#FF1493',
  ice:      '#00CFCF',
  dragon:   '#5B00FF',
  dark:     '#3D2B1F',
  fairy:    '#FF69B4',
  normal:   '#8A8A6A',
  fighting: '#CC1100',
  poison:   '#9B00CC',
  ground:   '#C8860A',
  flying:   '#7B68EE',
  bug:      '#6AAF00',
  rock:     '#A67C00',
  ghost:    '#4B0082',
  steel:    '#708090',
};

const GENERATIONS: { gen: number; label: string; range: string }[] = [
  { gen: 1, label: 'GEN I',   range: '#001–151' },
  { gen: 2, label: 'GEN II',  range: '#152–251' },
  { gen: 3, label: 'GEN III', range: '#252–386' },
  { gen: 4, label: 'GEN IV',  range: '#387–493' },
  { gen: 5, label: 'GEN V',   range: '#494–649' },
  { gen: 6, label: 'GEN VI',  range: '#650–721' },
  { gen: 7, label: 'GEN VII', range: '#722–809' },
  { gen: 8, label: 'GEN VIII',range: '#810–905' },
  { gen: 9, label: 'GEN IX',  range: '#906–1025'},
];

interface FilterBarProps {
  filterType: string | null;
  filterGen: number | null;
  sortBy: SortBy;
  onFilterType: (type: string | null) => void;
  onFilterGen: (gen: number | null) => void;
  onSortBy: (sort: SortBy) => void;
}

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'id-asc',   label: '#001 first' },
  { value: 'id-desc',  label: '#999 first' },
  { value: 'name-asc', label: 'A → Z' },
  { value: 'name-desc',label: 'Z → A' },
];

export const FilterBar: React.FC<FilterBarProps> = ({ filterType, filterGen, sortBy, onFilterType, onFilterGen, onSortBy }) => {
  return (
    <div className="filter-bar">
      <div className="filter-row">
        <span className="filter-label">SORT</span>
        <div className="sort-options">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`sort-btn${sortBy === opt.value ? ' sort-btn--active' : ''}`}
              onClick={() => onSortBy(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-row">
        <span className="filter-label">GEN</span>
        <div className="gen-pills">
          <button
            className={`gen-pill${filterGen === null ? ' gen-pill--active' : ''}`}
            onClick={() => onFilterGen(null)}
          >
            ALL
          </button>
          {GENERATIONS.map(({ gen, label, range }) => (
            <button
              key={gen}
              className={`gen-pill${filterGen === gen ? ' gen-pill--active' : ''}`}
              onClick={() => onFilterGen(filterGen === gen ? null : gen)}
              title={range}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-row">
        <span className="filter-label">TYPE</span>
        <div className="type-pills">
          <button
            className={`type-pill${filterType === null ? ' type-pill--active' : ''}`}
            style={filterType === null ? { backgroundColor: '#555' } : {}}
            onClick={() => onFilterType(null)}
          >
            ALL
          </button>
          {TYPES.map(type => (
            <button
              key={type}
              className={`type-pill${filterType === type ? ' type-pill--active' : ''}`}
              style={{ backgroundColor: TYPE_COLORS[type] }}
              onClick={() => onFilterType(filterType === type ? null : type)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
