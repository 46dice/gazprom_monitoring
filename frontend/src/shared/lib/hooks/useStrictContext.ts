import { useContext, type Context } from "react";

export const useStrictContext = <T>(context: Context<T | null>): T => {
  const value = useContext(context);

  // Забытый провайдер — ошибка сборки экрана, а не «пустые данные» где-то ниже.
  if (value === null) {
    throw new Error("Пустое значение контекста: компонент вне своего провайдера");
  }

  return value;
};
