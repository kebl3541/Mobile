import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { formatHour, formatHour24, getWeatherIcon } from '../../utils/weatherUtils';
import { MESSAGES } from '../../constants/Messages';
import { COLORS } from '../../constants/Colors';
import BaseWeatherChart, { VictoryLine, VictoryArea } from '../weather/BaseWeatherChart';
import GlassCard from '../common/GlassCard';
import SkeletonLoader from '../common/SkeletonLoader';
import WeatherViewLayout from '../weather/WeatherViewLayout';
import LocationHeader from '../weather/LocationHeader';
import WeatherCard from '../weather/WeatherCard';

const TodayWeatherView = React.forwardRef(({ 
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

  const hourlyData = (forecast?.hourly || []).slice(0, 25);

  const chartData = useMemo(() => {
    return hourlyData.slice(0, 25).map((item, index) => ({
      hour: index,
      temp: parseFloat(item.temperature.toFixed(1)),
      hourLabelAxis: formatHour24(item.time),
    }));
  }, [hourlyData]);

  const renderSkeleton = () => (
    <View style={styles.mainContent}>
      <SkeletonLoader width="50%" height={20} style={{ alignSelf: 'center', marginBottom: 20 }} />
      <SkeletonLoader width="100%" height={250} borderRadius={24} style={{ marginBottom: 20 }} />
      <SkeletonLoader width="30%" height={16} style={{ marginLeft: 10, marginBottom: 10 }} />
      <SkeletonLoader width="100%" height={150} borderRadius={24} />
    </View>
  );

  const tickValuesX = useMemo(() => [0, 4, 8, 12, 16, 20, 24], []);

  const renderChart = () => {
    if (!chartData.length) return null;

    return (
      <BaseWeatherChart
        responsive={responsive}
        height={250}
        domainX={[0, 24]}
        tickValuesX={tickValuesX}
        tickFormatX={(t) => {
          if (t === 24) return "";
          return t.toString();
        }}
      >
        <VictoryArea
          data={chartData}
          x="hour"
          y="temp"
          labels={() => null}
          style={{
            data: { fill: COLORS.primary, fillOpacity: 0.1, stroke: "none" }
          }}
          interpolation="monotoneX"
        />
        <VictoryLine
          data={chartData}
          x="hour"
          y="temp"
          labels={() => null}
          style={{
            data: { stroke: COLORS.primary, strokeWidth: 3 }
          }}
          interpolation="monotoneX"
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
          {hourlyData.length > 0 ? (
            hourlyData.map((item) => (
              <WeatherCard
                key={item.time}
                title={formatHour(item.time)}
                icon={getWeatherIcon(item.weatherCode)}
                tempPrimary={item.temperature.toFixed(1)}
                detail={`${Math.round(item.windSpeed)} km/h`}
              />
            ))
          ) : (
            <Text style={styles.statusText}>{MESSAGES.NO_HOURLY_DATA}</Text>
          )}
        </View>
      </WeatherViewLayout>
    </View>
  );
});

export default React.memo(TodayWeatherView);

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
  dateText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: COLORS.dark,
    textAlign: 'center',
  },
  locationText: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  chartContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
    borderRadius: 24,
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  chartHeader: {
    paddingHorizontal: 2,
    marginBottom: 10,
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
    paddingRight: 2,
  },
  giftedChart: {
    marginTop: 6,
    borderRadius: 12,
  },
  chartYAxisText: {
    color: COLORS.gray,
    fontSize: 11,
    fontFamily: 'Outfit-SemiBold',
  },
  chartXAxisText: {
    color: COLORS.gray,
    fontSize: 11,
    fontFamily: 'Outfit-Medium',
    marginTop: 4,
  },
  listContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },

  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  hourText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: COLORS.dark,
    flex: 1,
    textAlign: 'left',
    paddingLeft: 20,
  },
  iconGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIcon: {
    // no specific margin needed now
  },
  tempText: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: COLORS.dark,
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