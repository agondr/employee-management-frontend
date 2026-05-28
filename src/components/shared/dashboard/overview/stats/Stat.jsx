import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Stat({ label, icon, stat }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <p className="font-medium">{label}</p>
          <CardDescription>{icon}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter>
        <CardTitle>{stat}</CardTitle>
      </CardFooter>
    </Card>
  );
}

export default Stat;
