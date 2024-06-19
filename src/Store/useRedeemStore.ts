import { create } from "zustand";

type Charity = {
  id: string;
  name: string;
  points: number;
};

type State = {
  activeRedeemCard:
    | "Gift card"
    | "Cheque"
    | "Donate to charity"
    | "E-transfer"
    | "Paypal";
  selectedCharity: Charity[];
  pointUsed: number;
  giftCardValue: number | undefined;
  cellularCode: string | undefined;
  cellularNumber: string | undefined;
  activeUserData: {
    firstName: string | undefined;
    lastName: string | undefined;
    MailingAddress: string | undefined;
    cityTown: string | undefined;
    phoneNumber: string | undefined;
    postalCode: string | undefined;
  };
};

type Action = {
  SetActiveRedeemCard: (label: State["activeRedeemCard"]) => void;
  SetSelectedCharity: (event: Charity[] | undefined) => void;
  SetPointUsed: (event: number) => void;
  SetGiftCardValue: (event: number | undefined) => void;
  SetCellularCode: (event: string | undefined) => void;
  SetCellularNumber: (event: string | undefined) => void;
  setActiveUserData: (event: State["activeUserData"]) => void;
  UpdatecharityPointsUsed: () => void;
  AddPointsToCharity: (name: string, points: number) => void;
};

export const useRedeemStore = create<State & Action>((set) => ({
  activeUserData: {
    firstName: "",
    lastName: "",
    MailingAddress: "",
    cityTown: "",
    phoneNumber: "",
    postalCode: "",
  },

  setActiveUserData: (event) =>
    set(() => ({
      activeUserData: {
        firstName: event.firstName,
        lastName: event.lastName,
        MailingAddress: event.MailingAddress,
        cityTown: event.cityTown,
        phoneNumber: event.phoneNumber,
        postalCode: event.postalCode,
      },
    })),

  activeRedeemCard: "Gift card",
  SetActiveRedeemCard: (label) => set(() => ({ activeRedeemCard: label })),

  selectedCharity: [],

  SetSelectedCharity: (event) =>
    set((state) => {
      // If event is undefined or null, return the state as is
      if (!event) {
        return state;
      }

      const updatedCharities = [];

      for (const newItem of event) {
        const existingCharity = state.selectedCharity.find(
          (charity) => charity.id === newItem.id
        );

        if (existingCharity) {
          updatedCharities.push(existingCharity); // Retain existing charity with its points
        } else {
          updatedCharities.push({
            id: newItem.id,
            name: newItem.name,
            points: 0,
          });
        }
      }

      return { selectedCharity: updatedCharities };
    }),

  AddPointsToCharity: (name: string, points: number) =>
    set((state) => {
      // Find the index of the selected charity with the matching name
      const charityIndex = state.selectedCharity.findIndex(
        (item) => item.name === name
      );
      // If the charity was found, update its points
      if (charityIndex !== -1) {
        const updatedCharities = [...state.selectedCharity];
        updatedCharities[charityIndex] = {
          ...updatedCharities[charityIndex],
          points: points,
        };

        return { selectedCharity: updatedCharities };
      }
      // If the charity was not found, return the state as is
      return state;
    }),

  pointUsed: 0,
  SetPointUsed: (event) => set(() => ({ pointUsed: event })),
  UpdatecharityPointsUsed: () => {
    set((state) => {
      const sumPoints = state.selectedCharity
        ?.map((item) => item.points)
        .reduce((sum, points) => sum + points, 0);

      return {
        pointUsed: sumPoints,
      };
    });
  },

  giftCardValue: 0,
  SetGiftCardValue: (event) => set(() => ({ giftCardValue: event })),

  cellularCode: "",
  SetCellularCode: (event) => set(() => ({ cellularCode: event })),

  cellularNumber: "",
  SetCellularNumber: (event) => set(() => ({ cellularNumber: event })),
}));

// type State = {
//   activeRedeemCard: "Gift card" | "Cheque" | "Donate to charity" | "E-transfer";
//   charityList: Charity[];
//   selectedCharity: Charity[];
//   pointUsed: number;
//   giftCardValue: number | undefined;
//   cellularCode: string | undefined;
//   cellularNumber: string | undefined;
//   activeUserData: {
//     firstName: string | undefined;
//     lastName: string | undefined;
//     MailingAddress: string | undefined;
//     cityTown: string | undefined;
//     phoneNumber: string | undefined;
//     postalCode: string | undefined;
//   };
// };

// type Action = {
//   SetActiveRedeemCard: (label: State["activeRedeemCard"]) => void;
//   setCharityList: (event: Charity[]) => void;
//   SetPointUsed: (event: number) => void;
//   SetGiftCardValue: (event: number | undefined) => void;
//   SetCellularCode: (event: string | undefined) => void;
//   SetCellularNumber: (event: string | undefined) => void;
//   setActiveUserData: (event: State["activeUserData"]) => void;
//   AddPointsToCharity: (name: string, points: number) => void;
//   UpdateCharityPointUsed: () => void;
//   SetSelectedCharity: (event: string[] | undefined) => void;
// };

// export const useRedeemStore = create<State & Action>((set) => ({
//   activeUserData: {
//     firstName: "",
//     lastName: "",
//     MailingAddress: "",
//     cityTown: "",
//     phoneNumber: "",
//     postalCode: "",
//   },

//   setActiveUserData: (event) =>
//     set(() => ({
//       activeUserData: {
//         firstName: event.firstName,
//         lastName: event.lastName,
//         MailingAddress: event.MailingAddress,
//         cityTown: event.cityTown,
//         phoneNumber: event.phoneNumber,
//         postalCode: event.postalCode,
//       },
//     })),

//   activeRedeemCard: "Gift card",
//   SetActiveRedeemCard: (label) => set(() => ({ activeRedeemCard: label })),

//   charityList: [],
//   setCharityList: (event) =>
//     set(() => {
//       const newstate = event.map((item) => ({
//         ...item,
//         points: 100,
//         active: false,
//       }));
//       return { charityList: newstate };
//     }),

//   AddPointsToCharity: (id: string, points: number) =>
//     set((state) => {
//       // Find the index of the selected charity with the matching name
//       const charityIndex = state.charityList.findIndex(
//         (item) => item.id === id
//       );

//       // If the charity was found, update its points
//       if (charityIndex !== -1) {
//         const updatedCharities = [...state.charityList];
//         updatedCharities[charityIndex] = {
//           ...updatedCharities[charityIndex],
//           points: points,
//         };

//         return { charityList: updatedCharities };
//       }
//       // If the charity was not found, return the state as is
//       return state;
//     }),

//   selectedCharity: [],
//   SetSelectedCharity: (event) =>
//     set((state) => {
//       if (!event) {
//         // If event is undefined or null, return the state as is
//         return state;
//       }

//       const updatedCharities: Charity[] = [];

//       for (const newItem of event) {
//         const existingCharity = state.selectedCharity.find(
//           (charity) => charity.name === newItem
//         );

//         if (existingCharity) {
//           updatedCharities.push(existingCharity); // Retain existing charity with its points
//         } else {
//           // updatedCharities.push({
//           //   name: newItem,
//           //   points: 100,
//           // });
//         }

//         return { selectedCharity: updatedCharities };
//       }
//     }),

//   pointUsed: 0,
//   SetPointUsed: (event) => set(() => ({ pointUsed: event })),
//   UpdateCharityPointUsed: () => {
//     set((state) => {
//       let sumPoints = 0;

//       const activeCharity = state.charityList
//         .filter((item) => item.active == true)
//         .map((item) => item.points);

//       if (activeCharity.length !== 0) {
//         const sumpoints = activeCharity.reduce((acc, points, index) => {
//           if (index === 0) {
//             return points;
//           }
//           if (points) {
//             return acc && acc + points;
//           }
//           return acc; // Return acc when points is falsy
//         }, 0);

//         sumPoints = sumpoints ? sumpoints : 0;
//       }
//       return {
//         pointUsed: sumPoints,
//       };
//     });
//   },

//   giftCardValue: 0,
//   SetGiftCardValue: (event) => set(() => ({ giftCardValue: event })),

//   cellularCode: "",
//   SetCellularCode: (event) => set(() => ({ cellularCode: event })),

//   cellularNumber: "",
//   SetCellularNumber: (event) => set(() => ({ cellularNumber: event })),
// }));
