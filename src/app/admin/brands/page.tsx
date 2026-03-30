import BrandsTable from "../../../components/desktop/admin/brands/BrandsTable";

export default function BrandsPage() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <BrandsTable />
      </div>
      {/* Mobile placeholder */}
      <div className="block md:hidden"></div>
    </>
  );
}
