import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { formatDate, getWeatherIcon } from '../../utils/weatherUtils';
import { MESSAGES } from '../../constants/Messages';
import { COLORS } from '../../constants/Colors';
import WeatherCard from '../weather/WeatherCard';
import BaseWeatherChart, { VictoryLine } from '../weather/BaseWeatherChart';
import GlassCard from '../common/GlassCard';
import SkeletonLoader from '../common/SkeletonLoader';
import WeatherViewLayout from '../weather/WeatherViewLayout';
import LocationHeader from '../weather/LocationHeader';

const WeeklyWeatherView = React.forwardRef(({ 
  responsive, 
  onScroll,
  forecast,
  submittedText,
  locationLabel,
  error,
  interactionLoading,
  forecastLoading,
  locationLoading
}, ref) => {

  const { middleText, middlePadH } = responsive;

  const dailyData = (forecast?.daily || []).slice(0, 8);

  const chartData = useMemo(() => {
    return dailyData.map((item, index) => ({
      dayIndex: index,
      tempMax: parseFloat(item.tempMax.toFixed(1)),
      tempMin: parseFloat(item.tempMin.toFixed(1)),
      dayLabel: formatDate(item.date).split(',')[0], 
    }));
  }, [dailyData]);

  const renderSkeleton = () => (
    <View style={styles.mainContent}>
      <SkeletonLoader width="50%" height={20} style={{ alignSelf: 'center', marginBottom: 20 }} />
      <SkeletonLoader width="100%" height={260} borderRadius={24} style={{ marginBottom: 20 }} />
      <SkeletonLoader width="30%" height={16} style={{ marginLeft: 10, marginBottom: 10 }} />
      <SkeletonLoader width="100%" height={250} borderRadius={24} />
    </View>
  );

  const tickValuesX = useMemo(() => [0, 1, 2, 3, 4, 5, 6], []);

  const renderChart = () => {
    if (!chartData.length) return null;

    return (
      <BaseWeatherChart
        responsive={responsive}
        height={260}
        domainX={[0, 7]}
        domainPadding={{ y: [20, 20], x: 0 }}
        tickValuesX={[0, 1, 2, 3, 4, 5, 6, 7]}
        tickFormatX={(t) => {
          if (t === 7) return "";
          const item = chartData.find((d) => d.dayIndex === t);
          return item ? item.dayLabel : '';
        }}
      >
        <VictoryLine
          data={chartData}
          x="dayIndex"
          y="tempMin"
          interpolation="monotoneX"
          labels={() => null}
          style={{
            data: { stroke: '#8FAEEF', strokeWidth: 3 },
          }}
        />
        <VictoryLine
          data={chartData}
          x="dayIndex"
          y="tempMax"
          interpolation="monotoneX"
          labels={() => null}
          style={{
            data: { stroke: '#f2b354ff', strokeWidth: 3 },
          }}
        />
      </BaseWeatherChart>
    );
  };

  const loading = interactionLoading || locationLoading || forecastLoading;

  return (
    <View style={[styles.container, { paddingHorizontal: 12 }]}>
      <WeatherViewLayout
        loading={loading}
        error={error}
        forecast={forecast}
        renderSkeleton={renderSkeleton}
        responsive={responsive}
        locationLabel={locationLabel}
        submittedText={submittedText}
        onScroll={onScroll}
        ref={ref}
      >
        {renderChart()}
        <View style={styles.listWrapper}>
          {dailyData.length > 0 ? (
            dailyData.map((item) => (
              <WeatherCard
                key={item.date}
                title={formatDate(item.date)}
                icon={getWeatherIcon(item.weatherCode)}
                tempPrimary={item.tempMax.toFixed(1)}
                tempSecondary={item.tempMin.toFixed(1)}
              />
            ))
          ) : (
            <Text style={styles.statusText}>{MESSAGES.NO_WEEKLY_DATA}</Text>
          )}
        </View>
      </WeatherViewLayout>
    </View>
  );
});

export default React.memo(WeeklyWeatherView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Outfit-Bold',
    color: COLORS.dark,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  mainContent: {
    width: '100%',
  },
  listWrapper: {
    width: '100%',
    marginTop: 15,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  chartContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 24,
    paddingTop: 16,
    paddingBottom: 10,
    marginBottom: 20,
  },
  chartHeader: {
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: COLORS.dark,
  },
  chartSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  chartInner: {
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -10,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.gray,
    fontFamily: 'Outfit-Medium',
  },
  listContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  dateGroup: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: COLORS.dark,
    textAlign: 'left',
    paddingLeft: 20,
  },
  descText: {
    fontSize: 12,
    color: COLORS.gray,
    textTransform: 'capitalize',
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 65,
    justifyContent: 'space-between',
  },
  iconGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maxTemp: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: COLORS.dark,
  },
  minTemp: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: COLORS.gray,
  },
  windText: {
    fontSize: 16,
    color: COLORS.gray,
    fontFamily: 'Outfit-Medium',
  },
  statusText: {
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.gray,
    paddingHorizontal: 20,
  },
  errorText: {
    color: COLORS.errorText,
  },
});
