import React, { useState } from "react";
import Svg from "../Svg";
import { useStore } from "~/utils/store";
import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import LoginMessageDialog from "~/components/LoginMessageDialog";
import DotsLoader from "~/components/DotsLoader";

export type RegisterButtonProps = {
  activityId: string;
  activitySlug: string;
  className?: string;
};

const Button = (
  { registrationsCount, onClick, isRegistered }: {
    registrationsCount: number;
    onClick: () => void;
    isRegistered: boolean;
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
        className={`mt-2 select-none cursor-pointer transition ${style}`}
        viewBox="0 0 40 40"
        onClick={onClick}
      >
        <path
          className="translate-y-1"
          id="ld"
          d="M12.688,26.479C11.707,27.458,10.4,28,9.008,28c-1.392,0-2.696-0.539-3.678-1.521c-0.231-0.231-0.437-0.484-0.617-0.752   v-2.146c0-1.903,1.64-4.245,3.646-5.196l1.477-0.701c1.075,0.17,2.068,0.656,2.852,1.439C14.714,21.15,14.714,24.45,12.688,26.479z    M18.444,16.193c3.921,0,7.096-4.877,7.096-9.347C25.54,2.373,22.365,0,18.444,0c-3.918,0-7.094,2.373-7.094,6.846   C11.354,11.316,14.526,16.193,18.444,16.193z M28.533,18.385l-4.603-2.188l-3.035,6.312l-1.504-4.087   c-0.313,0.061-0.621,0.139-0.946,0.139c-0.324,0-0.636-0.078-0.947-0.139l-0.86,2.335c0.541,2.029,0.277,4.242-0.859,6.125   c0.17,0.093,0.328,0.207,0.467,0.347l1.48,1.48H32.18v-5.124C32.18,21.678,30.538,19.336,28.533,18.385z M19.94,32.055   c0.225,0.227,0.348,0.522,0.348,0.84c0,0.316-0.123,0.614-0.348,0.84c-0.227,0.226-0.522,0.349-0.84,0.349   c-0.316,0-0.615-0.123-0.84-0.349l-4.262-4.262c-0.161-0.162-0.271-0.367-0.32-0.596l-0.123-0.588l-0.494,0.343   c-1.193,0.831-2.6,1.271-4.063,1.271c-1.896,0-3.679-0.735-5.017-2.073c-2.771-2.771-2.771-7.282,0-10.053   c1.341-1.342,3.125-2.079,5.025-2.079c1.901,0,3.686,0.737,5.026,2.079c2.435,2.434,2.772,6.251,0.805,9.08l-0.344,0.494   l0.589,0.123c0.229,0.049,0.434,0.158,0.596,0.32L19.94,32.055z M13.253,18.557c-1.133-1.133-2.64-1.756-4.245-1.756   c-1.604,0-3.112,0.623-4.243,1.756c-2.342,2.34-2.342,6.147,0,8.488c1.131,1.132,2.64,1.756,4.243,1.756   c1.605,0,3.112-0.624,4.245-1.756C15.593,24.704,15.593,20.896,13.253,18.557z"
        />
      </Svg>
    </>
  );
};

const RegisterButton = (
  { activitySlug, activityId, className = "" }: RegisterButtonProps,
) => {
  const store = useStore();
  const session = useSession();

  const { mutate: register } = api.registrations.add.useMutation();
  const { mutate: unregister } = api.registrations.remove.useMutation();

  const [showLoginMessageDialog, setShowLoginMessageDialog] = useState(false);

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
      setShowLoginMessageDialog(true);
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
  // const style = isRegistered
  //   ? "stroke-[#33BBFF] stroke-2 hover:fill-white "
  //   : "fill-[#6666FF] ";

  return (
    <>
      {showLoginMessageDialog && (
        <LoginMessageDialog
          onCancel={() => setShowLoginMessageDialog(false)}
        />
      )}

      <Button
        isRegistered={isRegistered}
        registrationsCount={registrationsCount}
        onClick={toggleRegister}
      />
      {isRegistered && (
        <DotsLoader className="fill-[#33BBFF] max-h-3 relative top-5 right-8 -mr-8 pr-1 z-0" />
      )}
    </>
  );
};

export default RegisterButton;
