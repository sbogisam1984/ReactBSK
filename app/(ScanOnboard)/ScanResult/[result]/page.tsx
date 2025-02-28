export default function ScanResultPage({ params }: { params: { result: string } }) {
  const result = params.result;
  console.log(params.result);
  if (result == 'Success') {
    return (
      <>
        <div>Placeholder content for success scan result</div>
      </>
    );
  } else if (result == 'Failure') {
    return (
      <>
        <div>Placeholder content for failed scan result</div>
      </>
    );
  }
}
