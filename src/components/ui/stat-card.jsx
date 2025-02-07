import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PropTypes from "prop-types";

export function StatCard({
  title,
  subtitle,
  value,
  icon: Icon,
  description,
  className,
  trend,
  trendValue,
  valuePrefix = "",
  valueSuffix = "",
  loading,
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          {subtitle && <Skeleton className="h-4 w-24" />}
        </CardContent>
      </Card>
    );
  }
  // Format trend value if provided
  const formattedTrend = trendValue ? (
    <span
      className={`${Number(trendValue) >= 0 ? "text-green-500" : "text-red-500"}`}
    >
      {Number(trendValue) >= 0 ? "+" : ""}
      {trendValue}%
    </span>
  ) : null;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {valuePrefix}
          {value}
          {valueSuffix}
        </div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground">
            {description}
            {description && trend && " "}
            {trend && (
              <>
                {formattedTrend} {trend}
              </>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  description: PropTypes.string,
  className: PropTypes.string,
  trend: PropTypes.string,
  trendValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valuePrefix: PropTypes.string,
  valueSuffix: PropTypes.string,
  loading: PropTypes.bool,
};

export default StatCard;
