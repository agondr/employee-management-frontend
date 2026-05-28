import Stat from "./Stat";
import { DollarSign, ListChecks, ListTodo, Users } from "lucide-react";

function Stats() {
  return (
    <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-6">
      <Stat label="Departments" icon={<DollarSign size={22} />} stat="$4500" />
      <Stat label="Total users" icon={<Users size={22} />} stat="$4500" />
      <Stat label="Total Tasks" icon={<ListTodo size={22} />} stat="$4500" />
      <Stat label="Done Tasks" icon={<ListChecks size={22} />} stat="$4500" />
    </div>
  );
}

export default Stats;
