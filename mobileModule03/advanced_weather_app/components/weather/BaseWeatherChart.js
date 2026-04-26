import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS } from '../../constants/Colors';

let VictoryChart, VictoryLine, VictoryAxis, VictoryArea;

if (Platform.OS === 'web') {
  const Victory = require('victory');
  VictoryChart = Victory.VictoryChart;
  VictoryLine = Victory.VictoryLine;
  VictoryAxis = Victory.VictoryAxis;
  VictoryArea = Victory.VictoryArea;
} else {
  const VictoryNative = require('victory-native');
  VictoryChart = VictoryNative.VictoryChart;
  VictoryLine = VictoryNative.VictoryLine;
  VictoryAxis = VictoryNative.VictoryAxis;
  VictoryArea = VictoryNative.VictoryArea;
}

import GlassCard from '../common/GlassCard';

const BaseWeatherChart = React.memo(({ 
  title, 
  subtitle, 
  children, 
  responsive,
  height = 260,
  domainX,
  tickValuesX,
  tickFormatX,
  tickFormatY = (t) => {
    const val = Math.round(t * 10) / 10;
    return `${val}°`;
  },
  domainPadding = { y: [20, 20], x: 0 },
}) => {
  const { middlePadH } = responsive;
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 20; 

  return (
    <GlassCard opacity={0.18} style={styles.chartContainer}>
      {(title || subtitle) && (
        <View style={styles.chartHeader}>
          {title ? <Text style={styles.chartTitle}>{title}</Text> : null}
          {subtitle ? <Text style={styles.chartSubtitle}>{subtitle}</Text> : null}
        </View>
      )}

      <View style={styles.chartInner}>
        <VictoryChart
          width={chartWidth}
          height={height}
          padding={{ top: 20, bottom: 45, left: 50, right: 50 }} 
          domain={domainX ? { x: domainX } : undefined}
          domainPadding={domainPadding}
        >
          <VictoryAxis
            tickValues={tickValuesX}
            tickFormat={tickFormatX}
            orientation="bottom"
            offsetY={45}
            crossAxis={false}
            fixLabelOverlap={true}
            style={{
              axis: { stroke: 'rgba(0,0,0,0.1)' },
              tickLabels: { fontSize: 10, fill: COLORS.gray, padding: 8, fontFamily: 'Outfit-Medium' },
              grid: { stroke: 'transparent' },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={tickFormatY}
            crossAxis={false}
            fixLabelOverlap={true}
            style={{
              axis: { stroke: 'rgba(0,0,0,0.1)' },
              tickLabels: { fontSize: 10, fill: COLORS.gray, padding: 8, fontFamily: 'Outfit-Medium' },
              grid: { stroke: 'rgba(0,0,0,0.05)' },
            }}
          />
          {children}
        </VictoryChart>
      </View>
    </GlassCard>
  );
});

export default BaseWeatherChart;

// Re-export Victory components to use them inside BaseWeatherChart
export { VictoryLine, VictoryArea };

const styles = StyleSheet.create({
  chartContainer: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
    marginBottom: 5,
  },
  chartHeader: {
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  chartTitle: {
    fontSize: 15,
    fontFamily: 'Outfit-Bold',
    color: COLORS.dark,
  },
  chartSubtitle: {
    fontSize: 11,
    color: COLORS.gray,
    fontFamily: 'Outfit-Medium',
    marginTop: 1,
  },
  chartInner: {
    paddingRight: 0,
  },
});
