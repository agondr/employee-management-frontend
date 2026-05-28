import React from "react";

function Header({ title, subtitle, children }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <h1 className="text-primary text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

export default Header;
