import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/Colors';
import GlassCard from '../common/GlassCard';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const WeatherCard = ({ 
  title, 
  subtitle, 
  icon, 
  tempPrimary, 
  tempSecondary, 
  detail,
  style 
}) => {
  return (
    <GlassCard opacity={0.15} style={[styles.card, style]}>
      <View style={styles.leftSection}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>

      <View style={styles.centerSection}>
        <Ionicons name={icon} size={32} color={COLORS.primary} />
      </View>

      <View style={styles.rightSection}>
        <View style={styles.tempContainer}>
          <Text style={styles.tempPrimary}>{tempPrimary}°</Text>
          {tempSecondary ? (
            <Text style={styles.tempSecondary}>{tempSecondary}°</Text>
          ) : null}
        </View>
        {detail ? (
          <View style={styles.detailContainer}>
            <MaterialCommunityIcons name="weather-windy" size={14} color={COLORS.gray} style={styles.detailIcon} />
            <Text style={styles.detailText}>{detail}</Text>
          </View>
        ) : null}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 20,
  },
  leftSection: {
    flex: 2,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontFamily: 'Outfit-Bold',
    color: COLORS.dark,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
    fontFamily: 'Outfit-Medium',
    textTransform: 'capitalize',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  tempPrimary: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    color: COLORS.dark,
  },
  tempSecondary: {
    fontSize: 15,
    fontFamily: 'Outfit-SemiBold',
    color: COLORS.gray,
    marginLeft: 8,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailText: {
    fontSize: 13,
    fontFamily: 'Outfit-SemiBold',
    color: COLORS.gray,
  },
});

export default React.memo(WeatherCard);
