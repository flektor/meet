// import { useEffect, useState } from "react";
// import { useStore } from "../utils/store";

// type Registrations = {
//   eventName: string;
// }[];

// export default function useRegistration(callback: (data: MessageType) => void) {
//   const store = useStore();
//   const [registrations, setRegistrations] = useState<Registrations>(
//     [],
//   );

//   useEffect(() => {
//     setRegistrations(
//       store.activities.map((activity) => ({ eventName: activity.id })),
//     );
//   }, [store.activities]);

//   return { registrations };
// }
