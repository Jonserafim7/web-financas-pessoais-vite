import type { TransactionResponseDto } from "@/lib/generated/models/transactionResponseDto";

interface TransactionItemProps {
  transaction: TransactionResponseDto;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  return (
    <div>
      <span>{transaction.amount}</span>
      <span>{transaction.description}</span>
      <span>{transaction.date}</span>
      <span>{transaction.type}</span>
      <span>{transaction.category.name}</span>
    </div>
  );
}
