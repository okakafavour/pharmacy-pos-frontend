import { useZxing } from "react-zxing";

function BarcodeScanner({ onDetected }) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onDetected(result.getText());
    },
  });

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted
      style={{
        width: "100%",
        minHeight: "300px",
        background: "#000",
      }}
    />
  );
}

export default BarcodeScanner;