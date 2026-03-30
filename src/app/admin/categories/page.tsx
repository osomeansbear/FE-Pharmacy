import CategoriesTable from "../../../components/desktop/admin/categories/CategoriesTable";

export default function CategoriesPage() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <CategoriesTable />
      </div>
      {/* Mobile placeholder */}
      <div className="block md:hidden"></div>
    </>
  );
}
