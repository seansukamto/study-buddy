export const FindGroupPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-green-700 mb-8">
        Available Groups
      </h1>
      <ul className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <li className="py-2 border-b">Group 1</li>
        <li className="py-2 border-b">Group 2</li>
        <li className="py-2 border-b">Group 3</li>
      </ul>
    </div>
  );
};

