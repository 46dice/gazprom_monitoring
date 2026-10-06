import { isCategoricalPoints, type ChartPoint, type Series } from "../model/types";
import { BarChartView } from "./BarChartView";
import { LineChartView } from "./LineChartView";

type Props = {
  points: ChartPoint[];
  series: Pick<Series, "id" | "label" | "colorSlot">[];
  size?: "card" | "full";
};

/**
 * Форма графика по оси X: годы/даты/числа — линия, текст (завод, вид дефекта) — столбики:
 * у категорий нет порядка, линия между ними соврала бы о «переходе».
 * Один выбор на карточку и окно «на весь экран».
 */
export const ChartView = ({ points, series, size = "card" }: Props) =>
  isCategoricalPoints(points) ? (
    <BarChartView points={points} series={series} size={size} />
  ) : (
    <LineChartView points={points} series={series} />
  );
