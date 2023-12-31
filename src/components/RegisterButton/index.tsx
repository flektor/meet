import React from "react";
import Svg from "../Svg";
import { useStore } from "~/utils/store";
import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import DotsLoader from "~/components/DotsLoader";

export type RegisterButtonProps = {
  activityId: string;
  activitySlug: string;
  className?: string;
};

const Button = (
  { registrationsCount, onClick, isRegistered, className }: {
    registrationsCount: number;
    onClick: () => void;
    isRegistered: boolean;
    className?: string;
  },
) => {
  const style = isRegistered
    ? "fill-[#33BBFF] hover:fill-white"
    : "stroke-2 stroke-[#33BBFF] hover:fill-white/10 hover:stroke-white";
  return (
    <>
      <span
        className={`transition text-base pt-1.5 text-[#33BBFF] ml-${
          registrationsCount > 0 ? 3 : 2
        } mr-2`}
      >
        {registrationsCount > 0 && registrationsCount}
      </span>

      <Svg
        className={` select-none cursor-pointer transition ${style} ${className}`}
        viewBox="0 0 30 30"
        onClick={onClick}
      >
        <path
          strokeWidth={1.3}
          d="M11.9092353,13.9995832 L19.7530511,13.999921 C20.9956918,13.999921 22.0030511,15.0072804 22.0030511,16.249921 L22.0030511,17.1550008 C22.0030511,18.2486786 21.5255957,19.2878579 20.6957793,20.0002733 C19.1303315,21.344244 16.8899962,22.0010712 14,22.0010712 L13.8209523,21.9999374 C14.1231382,21.3914232 14.0491694,20.6437608 13.5994596,20.1034984 L13.4890106,19.9826619 L11.2590774,17.758722 C11.7394467,16.9316429 12,15.9850969 12,15 C12,14.6583572 11.96885,14.3239899 11.9092353,13.9995832 Z M6.5,10.5 C8.98528137,10.5 11,12.5147186 11,15 C11,16.093806 10.6097492,17.0964639 9.96088672,17.8763348 L12.782748,20.6906119 C13.0759905,20.9831554 13.0765571,21.4580288 12.7840136,21.7512713 C12.5180649,22.0178554 12.1014304,22.0425586 11.8075592,21.8250546 L11.7233542,21.7525368 L8.82025196,18.8564864 C8.14273609,19.2649895 7.34881286,19.5 6.5,19.5 C4.01471863,19.5 2,17.4852814 2,15 C2,12.5147186 4.01471863,10.5 6.5,10.5 Z M6.5,12 C4.84314575,12 3.5,13.3431458 3.5,15 C3.5,16.6568542 4.84314575,18 6.5,18 C8.15685425,18 9.5,16.6568542 9.5,15 C9.5,13.3431458 8.15685425,12 6.5,12 Z M14,2.0046246 C16.7614237,2.0046246 19,4.24320085 19,7.0046246 C19,9.76604835 16.7614237,12.0046246 14,12.0046246 C11.2385763,12.0046246 9,9.76604835 9,7.0046246 C9,4.24320085 11.2385763,2.0046246 14,2.0046246 Z"
        />
      </Svg>
    </>
  );
};

const RegisterButton = (
  { activitySlug, activityId, className }: RegisterButtonProps,
) => {
  const store = useStore();
  const session = useSession();

  const { mutate: register } = api.registrations.add.useMutation();
  const { mutate: unregister } = api.registrations.remove.useMutation();

  const activity = store.activities.find(({ id }) => id === activityId);
  const isRegistered = activity?.isRegistered ?? false;

  let registrationsCount = 0;
  if (activity?.registrationsCount) {
    if (isRegistered) {
      registrationsCount = activity.registrationsCount - 1;
    } else {
      registrationsCount = activity.registrationsCount;
    }
  }

  function toggleRegister() {
    if (session.status !== "authenticated") {
      store.setShowLoginMessageDialog(true);
      return;
    }
    if (!activity) {
      return;
    }
    if (isRegistered) {
      store.removeFromRegistrations(activityId);
      unregister({ activityId });
      return;
    }

    register({ activityId, activitySlug, channelId: activity.channelId });
    store.addToRegistrations(activityId);
  }

  return (
    <div className={`flex ${className}`}>
      <div className="flex flex-coll">
        <Button
          isRegistered={isRegistered}
          registrationsCount={registrationsCount}
          onClick={toggleRegister}
          className="relative top-1"
        />
        {isRegistered && (
          <DotsLoader className="fill-[#33BBFF] max-h-3 relative top-[25px] right-[29px] -mr-8 pr-1 z-0" />
        )}
      </div>
    </div>
  );
};

export default RegisterButton;
