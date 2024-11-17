'use client'
import { TailSpin } from "react-loader-spinner";
import ReactModal from "react-modal";


export default function Loading() {
    return (
        <ReactModal
            isOpen={true}
            style={{
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                },
                content: {
                    top: "50%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    marginRight: "-50%",
                    transform: "translate(-50%, -50%)",
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                },
            }}
        >
            <TailSpin
                visible={true}
                height="80"
                width="80"
                color="#F9B421"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </ReactModal>
    );
}
    