interface Props {
  message: string;
}

export function ErrorMessage({ message }: Props) {
  return (
    <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{message}</p>
  );
}
