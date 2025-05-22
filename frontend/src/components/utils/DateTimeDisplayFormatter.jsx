export const formatDateTime = (dateString) => {
  if (dateString == null) {
    return <p class="block">-</p>;
  }
  const date = new Date(dateString);

  const formattedDate = date.toISOString().split('T')[0];
  const formattedTime = date.toTimeString().split(' ')[0];

  return (
    <>
      <p class="block">{formattedDate}</p>
      <p class="block">{formattedTime}</p>
    </>
  )
}
