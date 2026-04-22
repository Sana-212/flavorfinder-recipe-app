// screens/ProfileScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Switch, ScrollView, Alert, StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setName, toggleTheme } from '../redux/profileSlice';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius } from '../styles/globalStyles';

// ─── Reusable setting row ──────────────────────────────────────────────────────
const SettingRow = ({ icon, label, right, onPress, isFirst = false, colors }) => (
  <TouchableOpacity
    style={[
      rowStyles.row,
      !isFirst && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
    ]}
    onPress={onPress}
    activeOpacity={onPress ? 0.6 : 1}
  >
    <View style={rowStyles.left}>
      <View style={[rowStyles.iconBox, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon} size={17} color={colors.primary} />
      </View>
      <Text style={[rowStyles.label, { color: colors.text }]}>{label}</Text>
    </View>
    <View>{right}</View>
  </TouchableOpacity>
);

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: 14 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 15 },
});

// ─── Main screen ──────────────────────────────────────────────────────────────
const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { colors, isDarkMode } = useTheme();
  const { name } = useSelector((state) => state.profile);
  const favoriteCount = useSelector((state) => state.favorites.items.length);

  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleSaveName = () => {
    if (tempName.trim() === '') {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }
    dispatch(setName(tempName.trim()));
    setEditingName(false);
  };

  const handleCancelEdit = () => {
    setTempName(name);
    setEditingName(false);
  };

  const getInitials = () => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />

      {/* ── Header card ───────────────────────────────────────────── */}
      <View style={[styles.headerCard, { backgroundColor: colors.surface, borderTopColor: colors.primary }]}>
        {/* Avatar */}
        <View style={[styles.avatarRing, { borderColor: colors.primary }]}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
        </View>

        {/* Name / edit */}
        {editingName ? (
          <View style={styles.editRow}>
            <TextInput
              style={[styles.nameInput, { color: colors.text, borderBottomColor: colors.primary }]}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Your name"
              placeholderTextColor={colors.textLight}
              autoFocus
              maxLength={24}
              returnKeyType="done"
              onSubmitEditing={handleSaveName}
            />
            <TouchableOpacity onPress={handleSaveName} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelEdit} style={[styles.cancelBtn, { borderColor: colors.border }]}>
              <Ionicons name="close" size={18} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.nameRow}
            onPress={() => { setTempName(name); setEditingName(true); }}
            activeOpacity={0.7}
          >
            <Text style={[styles.nameText, { color: colors.text }]}>
              {name || 'Set your name'}
            </Text>
            <View style={[styles.editBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="pencil" size={11} color={colors.primary} />
              <Text style={[styles.editBadgeText, { color: colors.primary }]}>Edit</Text>
            </View>
          </TouchableOpacity>
        )}

        <Text style={[styles.memberText, { color: colors.textLight }]}>FlavorFinder Member</Text>

        <View style={[styles.headerDivider, { backgroundColor: colors.border }]} />

        {/* Real stat: favorites */}
        <View style={styles.statRow}>
          <MaterialCommunityIcons name="heart" size={18} color={colors.primary} />
          <Text style={[styles.statCount, { color: colors.text }]}>{favoriteCount}</Text>
          <Text style={[styles.statLabel, { color: colors.textLight }]}>
            {favoriteCount === 1 ? 'Saved Recipe' : 'Saved Recipes'}
          </Text>
        </View>
      </View>

      {/* ── Preferences ───────────────────────────────────────────── */}
      <Text style={[styles.sectionHeader, { color: colors.textLight }]}>PREFERENCES</Text>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <SettingRow
          colors={colors}
          icon={isDarkMode ? 'moon' : 'sunny-outline'}
          label="Dark Mode"
          isFirst
          right={
            <Switch
              value={isDarkMode}
              onValueChange={() => dispatch(toggleTheme())}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          }
        />
      </View>

      {/* ── Your data ─────────────────────────────────────────────── */}
      <Text style={[styles.sectionHeader, { color: colors.textLight }]}>YOUR DATA</Text>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <SettingRow
          colors={colors}
          icon="heart-outline"
          label="Saved Recipes"
          isFirst
          right={
            <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.countBadgeText}>{favoriteCount}</Text>
            </View>
          }
        />
        <SettingRow
          colors={colors}
          icon="person-outline"
          label="Display Name"
          right={
            <Text style={[styles.valueText, { color: colors.textLight }]} numberOfLines={1}>
              {name || '—'}
            </Text>
          }
          onPress={() => { setTempName(name); setEditingName(true); }}
        />
      </View>

      {/* ── About ─────────────────────────────────────────────────── */}
      <Text style={[styles.sectionHeader, { color: colors.textLight }]}>ABOUT</Text>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <SettingRow
          colors={colors}
          icon="information-circle-outline"
          label="App Version"
          isFirst
          right={<Text style={[styles.valueText, { color: colors.textLight }]}>1.0.0</Text>}
        />
        <SettingRow
          colors={colors}
          icon="color-palette-outline"
          label="Powered by TheMealDB"
          right={<Ionicons name="open-outline" size={15} color={colors.textLight} />}
        />
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },

  // Header card
  headerCard: {
    borderRadius: 20, alignItems: 'center',
    paddingTop: 32, paddingBottom: 20, paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg, borderTopWidth: 3,
  },
  avatarRing: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 2.5, padding: 3, marginBottom: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarCircle: {
    width: '100%', height: '100%', borderRadius: 100,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 30, fontWeight: '700', color: '#fff', letterSpacing: 1 },

  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  nameText: { fontSize: 20, fontWeight: '700', letterSpacing: 0.3 },
  editBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20,
  },
  editBadgeText: { fontSize: 11, fontWeight: '600' },

  editRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    width: '100%', marginBottom: 4, paddingHorizontal: 4,
  },
  nameInput: {
    flex: 1, fontSize: 18, fontWeight: '600',
    borderBottomWidth: 2, paddingVertical: 4, paddingHorizontal: 2,
  },
  saveBtn: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  cancelBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },

  memberText: { fontSize: 12, marginTop: 2, letterSpacing: 0.5 },
  headerDivider: { width: '80%', height: StyleSheet.hairlineWidth, marginVertical: 16 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statCount: { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 13 },

  // Sections
  sectionHeader: {
    ...typography.label, marginBottom: 8, marginLeft: 4,
  },
  card: { borderRadius: borderRadius.lg, overflow: 'hidden', marginBottom: spacing.lg },
  valueText: { fontSize: 14, maxWidth: 120, textAlign: 'right' },
  countBadge: {
    borderRadius: 12, minWidth: 26, height: 26,
    paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center',
  },
  countBadgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});

export default ProfileScreen;