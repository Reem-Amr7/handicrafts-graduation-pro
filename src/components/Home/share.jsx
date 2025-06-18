import { FaShare } from "react-icons/fa";

export default function Share({ post }) {
  return (
    <div className="flex items-center gap-1 cursor-pointer text-red-900 ${styles.postActionButton}">
      <FaShare />
      <span>مشاركة</span>
    </div>
  );
}