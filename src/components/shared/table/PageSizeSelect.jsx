import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZES = [10, 20, 50];

function PageSizeSelect({ value, onChange }) {
  return (
    <Select value={String(value)} onValueChange={(nextValue) => onChange(Number(nextValue))}>
      <SelectTrigger className="w-[110px]">
        <SelectValue placeholder="Rows" />
      </SelectTrigger>
      <SelectContent>
        {PAGE_SIZES.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {size} rows
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default PageSizeSelect;
