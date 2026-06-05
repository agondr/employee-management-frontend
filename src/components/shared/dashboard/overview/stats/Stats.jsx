import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Building2, ListChecks, ListTodo, Users } from "lucide-react";

import { fetchOverviewStats } from "@/store/statsSlice";
import Stat from "./Stat";

function Stats() {
  const dispatch = useDispatch();
  const { data, loading, error, hasFetched } = useSelector((state) => state.stats);

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchOverviewStats());
    }
  }, [dispatch, hasFetched]);

  const stats = [
    {
      label: "Departments",
      icon: <Building2 size={22} />,
      stat: data.departments,
    },
    {
      label: "Total Users",
      icon: <Users size={22} />,
      stat: data.totalUsers,
    },
    {
      label: "Total Tasks",
      icon: <ListTodo size={22} />,
      stat: data.totalTasks,
    },
    {
      label: "Done Tasks",
      icon: <ListChecks size={22} />,
      stat: data.doneTasks,
    },
  ];

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-6">
        {stats.map((item) => (
          <Stat
            key={item.label}
            label={item.label}
            icon={item.icon}
            stat={loading ? "..." : item.stat}
          />
        ))}
      </div>
    </div>
  );
}

export default Stats;
