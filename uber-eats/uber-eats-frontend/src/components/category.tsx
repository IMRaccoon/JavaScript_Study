interface ICategory {
  coverImg?: string;
  name: string;
}

export const Category: React.FC<ICategory> = ({ coverImg, name }) => (
  <div className="flex flex-col group items-center cursor-pointer">
    <div
      className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
      style={{ backgroundImage: `url(${coverImg})` }}
    />
    <span className="mt-1 text-sm text-center font-medium">{name}</span>
  </div>
);
