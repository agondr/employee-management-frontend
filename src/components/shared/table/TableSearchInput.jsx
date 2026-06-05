import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

function TableSearchInput({ value = "", onChange, placeholder }) {
  const [draft, setDraft] = useState(value);
  const onChangeRef = useRef(onChange);
  const didMountRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (draft === value) return;

    const timeoutId = setTimeout(() => {
      onChangeRef.current(draft);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [draft, value]);

  return (
    <Input
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      placeholder={placeholder}
      className="w-full sm:w-[260px]"
    />
  );
}

export default TableSearchInput;
