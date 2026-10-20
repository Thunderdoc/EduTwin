# 🔄 REAL-TIME SYNC PROMPT - EduFlow Flutter
## Complete Offline-First with Cloud Sync Implementation

---

## 🎯 OVERVIEW

Implement a **robust real-time synchronization system** for EduFlow Flutter app that:
- Works **offline-first** (local storage priority)
- Syncs seamlessly to **Firebase/Supabase** when online
- Handles **conflict resolution** intelligently
- Supports **multi-device sync**
- Enables **real-time collaboration** (teacher ↔ students)
- Maintains **data consistency** across devices
- Implements **efficient incremental sync**
- Provides **sync status indicators** to users

---

## 🏗️ ARCHITECTURE OVERVIEW

### Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│          UI Layer (Flutter)             │
│   (Student/Teacher Dashboards, etc.)    │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│       Sync Controller Layer             │
│  (Orchestrates offline-first logic)     │
└───────────────┬─────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
┌───────▼────────┐  ┌────▼────────────┐
│ Local Database │  │  Cloud Database │
│  (Hive/Isar)   │  │ (Firebase/      │
│                │  │  Supabase)      │
└────────────────┘  └─────────────────┘
```

---

## ☁️ BACKEND CHOICE: Firebase vs Supabase

### Option A: Firebase (Recommended for Beginners)
**Pros:**
- Easy setup
- Real-time database out of the box
- Excellent Flutter support
- Free tier generous
- Built-in authentication
- Cloud Functions for server logic

**Cons:**
- Vendor lock-in
- NoSQL (less flexible for complex queries)
- Can get expensive at scale

**Best for:** Rapid development, real-time features, simple queries

### Option B: Supabase (Recommended for Advanced)
**Pros:**
- PostgreSQL (powerful SQL queries)
- Open source
- Self-hostable
- More control
- Row-level security
- Real-time subscriptions

**Cons:**
- Steeper learning curve
- Smaller community
- Manual setup required

**Best for:** Complex data relationships, SQL flexibility, open-source preference

---

## 🔥 FIREBASE IMPLEMENTATION

### Step 1: Setup Firebase

#### 1.1 Create Firebase Project
1. Go to https://console.firebase.google.com
2. Create new project: "EduFlow"
3. Enable Firebase services:
   - ✅ Authentication
   - ✅ Firestore Database
   - ✅ Cloud Storage (for files)
   - ✅ Cloud Functions (optional)

#### 1.2 Configure Flutter App
```yaml
# pubspec.yaml
dependencies:
  firebase_core: ^2.24.0
  firebase_auth: ^4.15.0
  firebase_firestore: ^4.13.0
  cloud_firestore: ^4.13.0
  firebase_storage: ^11.5.0
  connectivity_plus: ^5.0.2
```

#### 1.3 Initialize Firebase
```dart
// lib/main.dart
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(MyApp());
}
```

---

### Step 2: Data Models with Sync Metadata

```dart
// lib/models/base_model.dart
abstract class SyncableModel {
  String id; // UUID
  DateTime createdAt;
  DateTime updatedAt;
  
  // Sync Metadata
  String syncStatus; // 'synced', 'pending', 'conflict', 'error'
  DateTime? lastSyncedAt;
  int syncVersion; // For conflict resolution
  String deviceId; // Which device created/modified
  
  Map<String, dynamic> toJson();
  void fromJson(Map<String, dynamic> json);
}
```

#### Example: UserProfile Model
```dart
// lib/models/user_profile.dart
class UserProfile extends SyncableModel {
  String id;
  String name;
  String email;
  String role; // 'student' or 'teacher'
  String? avatar;
  DateTime createdAt;
  DateTime updatedAt;
  
  // Sync Metadata
  String syncStatus;
  DateTime? lastSyncedAt;
  int syncVersion;
  String deviceId;
  
  UserProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.avatar,
    required this.createdAt,
    required this.updatedAt,
    this.syncStatus = 'pending',
    this.lastSyncedAt,
    this.syncVersion = 1,
    required this.deviceId,
  });
  
  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'role': role,
    'avatar': avatar,
    'createdAt': createdAt.toIso8601String(),
    'updatedAt': updatedAt.toIso8601String(),
    'syncStatus': syncStatus,
    'lastSyncedAt': lastSyncedAt?.toIso8601String(),
    'syncVersion': syncVersion,
    'deviceId': deviceId,
  };
  
  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
    id: json['id'],
    name: json['name'],
    email: json['email'],
    role: json['role'],
    avatar: json['avatar'],
    createdAt: DateTime.parse(json['createdAt']),
    updatedAt: DateTime.parse(json['updatedAt']),
    syncStatus: json['syncStatus'] ?? 'synced',
    lastSyncedAt: json['lastSyncedAt'] != null 
      ? DateTime.parse(json['lastSyncedAt']) 
      : null,
    syncVersion: json['syncVersion'] ?? 1,
    deviceId: json['deviceId'],
  );
}
```

#### Other Models to Implement
```dart
1. LearningSession (autonomous learning data)
2. LearningDNA (cognitive profile)
3. CognitiveState (real-time state)
4. MemoryStrength (per-concept memory)
5. ErrorRecord (error tracking)
6. Achievement (gamification)
7. Subject (custom subjects)
8. Note (user notes)
9. Flashcard (flashcards)
10. TestResult (quiz/test results)
```

---

### Step 3: Local Database (Hive)

```dart
// lib/database/local_database.dart
import 'package:hive_flutter/hive_flutter.dart';

class LocalDatabase {
  static Future<void> init() async {
    await Hive.initFlutter();
    
    // Register adapters
    Hive.registerAdapter(UserProfileAdapter());
    Hive.registerAdapter(LearningSessionAdapter());
    // ... register other adapters
    
    // Open boxes
    await Hive.openBox<UserProfile>('userProfiles');
    await Hive.openBox<LearningSession>('learningSessions');
    await Hive.openBox<LearningDNA>('learningDNA');
    // ... open other boxes
  }
  
  // Generic CRUD operations
  static Future<void> save<T>(String boxName, String key, T data) async {
    final box = await Hive.openBox<T>(boxName);
    await box.put(key, data);
  }
  
  static T? get<T>(String boxName, String key) {
    final box = Hive.box<T>(boxName);
    return box.get(key);
  }
  
  static Future<void> delete<T>(String boxName, String key) async {
    final box = Hive.box<T>(boxName);
    await box.delete(key);
  }
  
  static List<T> getAll<T>(String boxName) {
    final box = Hive.box<T>(boxName);
    return box.values.toList();
  }
  
  static Future<void> clear<T>(String boxName) async {
    final box = Hive.box<T>(boxName);
    await box.clear();
  }
}
```

---

### Step 4: Sync Controller (The Brain)

```dart
// lib/services/sync_controller.dart
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'dart:async';
import 'package:uuid/uuid.dart';

class SyncController {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final Connectivity _connectivity = Connectivity();
  
  bool _isOnline = false;
  bool _isSyncing = false;
  StreamSubscription? _connectivitySubscription;
  Timer? _syncTimer;
  
  // Device ID (generate once and store)
  late String deviceId;
  
  // Sync queue for pending operations
  final List<SyncOperation> _syncQueue = [];
  
  Future<void> initialize() async {
    // Get or create device ID
    deviceId = await _getDeviceId();
    
    // Listen to connectivity changes
    _connectivitySubscription = _connectivity.onConnectivityChanged.listen((result) {
      _onConnectivityChanged(result);
    });
    
    // Check initial connectivity
    final connectivityResult = await _connectivity.checkConnectivity();
    _onConnectivityChanged(connectivityResult);
    
    // Start periodic sync (every 30 seconds when online)
    _startPeriodicSync();
  }
  
  void _onConnectivityChanged(ConnectivityResult result) {
    final wasOnline = _isOnline;
    _isOnline = result != ConnectivityResult.none;
    
    if (!wasOnline && _isOnline) {
      // Just came online, trigger sync
      print('🌐 Connection restored. Starting sync...');
      syncAll();
    } else if (wasOnline && !_isOnline) {
      print('📴 Connection lost. Switching to offline mode.');
    }
  }
  
  void _startPeriodicSync() {
    _syncTimer = Timer.periodic(Duration(seconds: 30), (timer) {
      if (_isOnline && !_isSyncing) {
        syncAll();
      }
    });
  }
  
  Future<String> _getDeviceId() async {
    // Try to get existing device ID from local storage
    final prefs = await SharedPreferences.getInstance();
    String? storedId = prefs.getString('device_id');
    
    if (storedId == null) {
      // Generate new device ID
      storedId = Uuid().v4();
      await prefs.setString('device_id', storedId);
    }
    
    return storedId;
  }
  
  // ============================================================
  // MAIN SYNC FUNCTIONS
  // ============================================================
  
  /// Sync all pending data
  Future<void> syncAll() async {
    if (!_isOnline || _isSyncing) return;
    
    _isSyncing = true;
    print('🔄 Starting sync...');
    
    try {
      // Sync each data type
      await _syncUserProfile();
      await _syncLearningSessions();
      await _syncLearningDNA();
      await _syncCognitiveStates();
      await _syncAchievements();
      await _syncNotes();
      // ... sync other data types
      
      // Process sync queue
      await _processSyncQueue();
      
      print('✅ Sync completed successfully');
    } catch (e) {
      print('❌ Sync failed: $e');
    } finally {
      _isSyncing = false;
    }
  }
  
  /// Save data (offline-first)
  Future<void> saveData<T extends SyncableModel>(
    T data,
    String collection,
  ) async {
    // 1. Always save to local database first
    data.updatedAt = DateTime.now();
    data.deviceId = deviceId;
    data.syncStatus = 'pending';
    
    await LocalDatabase.save(collection, data.id, data);
    
    // 2. Try to sync to cloud immediately if online
    if (_isOnline) {
      try {
        await _syncToCloud(data, collection);
        data.syncStatus = 'synced';
        data.lastSyncedAt = DateTime.now();
        await LocalDatabase.save(collection, data.id, data);
      } catch (e) {
        print('Failed to sync immediately: $e');
        // Keep as 'pending', will sync later
        _syncQueue.add(SyncOperation(data, collection, OperationType.create));
      }
    } else {
      // Offline: Add to sync queue
      _syncQueue.add(SyncOperation(data, collection, OperationType.create));
    }
  }
  
  /// Update data (offline-first)
  Future<void> updateData<T extends SyncableModel>(
    T data,
    String collection,
  ) async {
    // Increment version for conflict detection
    data.syncVersion++;
    data.updatedAt = DateTime.now();
    data.deviceId = deviceId;
    data.syncStatus = 'pending';
    
    await LocalDatabase.save(collection, data.id, data);
    
    if (_isOnline) {
      try {
        await _syncToCloud(data, collection);
        data.syncStatus = 'synced';
        data.lastSyncedAt = DateTime.now();
        await LocalDatabase.save(collection, data.id, data);
      } catch (e) {
        _syncQueue.add(SyncOperation(data, collection, OperationType.update));
      }
    } else {
      _syncQueue.add(SyncOperation(data, collection, OperationType.update));
    }
  }
  
  /// Delete data (offline-first)
  Future<void> deleteData<T extends SyncableModel>(
    String id,
    String collection,
  ) async {
    // Mark as deleted locally (soft delete)
    await LocalDatabase.delete(collection, id);
    
    if (_isOnline) {
      try {
        await _firestore.collection(collection).doc(id).delete();
      } catch (e) {
        _syncQueue.add(SyncOperation(
          {'id': id} as T,
          collection,
          OperationType.delete,
        ));
      }
    } else {
      _syncQueue.add(SyncOperation(
        {'id': id} as T,
        collection,
        OperationType.delete,
      ));
    }
  }
  
  /// Get data (offline-first)
  Future<T?> getData<T extends SyncableModel>(
    String id,
    String collection,
  ) async {
    // Always try local first
    T? localData = LocalDatabase.get<T>(collection, id);
    
    if (localData != null) {
      return localData;
    }
    
    // If not found locally and online, fetch from cloud
    if (_isOnline) {
      try {
        final doc = await _firestore.collection(collection).doc(id).get();
        if (doc.exists) {
          // Save to local database
          final data = _parseDocument<T>(doc);
          await LocalDatabase.save(collection, id, data);
          return data;
        }
      } catch (e) {
        print('Failed to fetch from cloud: $e');
      }
    }
    
    return null;
  }
  
  // ============================================================
  // CLOUD SYNC FUNCTIONS
  // ============================================================
  
  Future<void> _syncToCloud<T extends SyncableModel>(
    T data,
    String collection,
  ) async {
    // Check for conflicts before syncing
    final cloudDoc = await _firestore.collection(collection).doc(data.id).get();
    
    if (cloudDoc.exists) {
      final cloudData = _parseDocument<T>(cloudDoc);
      
      // Conflict detection: Compare versions
      if (cloudData.syncVersion > data.syncVersion) {
        // Cloud version is newer - conflict!
        await _resolveConflict(data, cloudData, collection);
        return;
      }
    }
    
    // No conflict, safe to sync
    await _firestore.collection(collection).doc(data.id).set(data.toJson());
  }
  
  Future<void> _syncUserProfile() async {
    final profiles = LocalDatabase.getAll<UserProfile>('userProfiles');
    
    for (var profile in profiles) {
      if (profile.syncStatus == 'pending') {
        try {
          await _syncToCloud(profile, 'userProfiles');
          profile.syncStatus = 'synced';
          profile.lastSyncedAt = DateTime.now();
          await LocalDatabase.save('userProfiles', profile.id, profile);
        } catch (e) {
          print('Failed to sync profile ${profile.id}: $e');
        }
      }
    }
  }
  
  Future<void> _syncLearningSessions() async {
    final sessions = LocalDatabase.getAll<LearningSession>('learningSessions');
    
    for (var session in sessions) {
      if (session.syncStatus == 'pending') {
        try {
          await _syncToCloud(session, 'learningSessions');
          session.syncStatus = 'synced';
          session.lastSyncedAt = DateTime.now();
          await LocalDatabase.save('learningSessions', session.id, session);
        } catch (e) {
          print('Failed to sync session ${session.id}: $e');
        }
      }
    }
  }
  
  Future<void> _syncLearningDNA() async {
    final dnaProfiles = LocalDatabase.getAll<LearningDNA>('learningDNA');
    
    for (var dna in dnaProfiles) {
      if (dna.syncStatus == 'pending') {
        try {
          await _syncToCloud(dna, 'learningDNA');
          dna.syncStatus = 'synced';
          dna.lastSyncedAt = DateTime.now();
          await LocalDatabase.save('learningDNA', dna.id, dna);
        } catch (e) {
          print('Failed to sync DNA ${dna.id}: $e');
        }
      }
    }
  }
  
  // ... Similar functions for other data types
  
  Future<void> _processSyncQueue() async {
    while (_syncQueue.isNotEmpty) {
      final operation = _syncQueue.removeAt(0);
      
      try {
        switch (operation.type) {
          case OperationType.create:
          case OperationType.update:
            await _syncToCloud(operation.data, operation.collection);
            break;
          case OperationType.delete:
            await _firestore
              .collection(operation.collection)
              .doc(operation.data.id)
              .delete();
            break;
        }
      } catch (e) {
        print('Failed to process sync operation: $e');
        // Re-add to queue for retry
        _syncQueue.add(operation);
        break; // Stop processing queue on error
      }
    }
  }
  
  // ============================================================
  // CONFLICT RESOLUTION
  // ============================================================
  
  Future<void> _resolveConflict<T extends SyncableModel>(
    T localData,
    T cloudData,
    String collection,
  ) async {
    print('⚠️ Conflict detected for ${localData.id}');
    
    // Conflict resolution strategy: Last-write-wins (by updatedAt)
    if (localData.updatedAt.isAfter(cloudData.updatedAt)) {
      // Local is newer, overwrite cloud
      print('✅ Local version is newer, overwriting cloud');
      localData.syncVersion = cloudData.syncVersion + 1;
      await _firestore.collection(collection).doc(localData.id).set(localData.toJson());
      
      localData.syncStatus = 'synced';
      localData.lastSyncedAt = DateTime.now();
      await LocalDatabase.save(collection, localData.id, localData);
    } else {
      // Cloud is newer, overwrite local
      print('✅ Cloud version is newer, overwriting local');
      cloudData.syncStatus = 'synced';
      cloudData.lastSyncedAt = DateTime.now();
      await LocalDatabase.save(collection, cloudData.id, cloudData);
    }
    
    // Alternative strategies:
    // 1. Manual resolution (show UI to user)
    // 2. Merge changes (if possible)
    // 3. Keep both versions with different IDs
  }
  
  // ============================================================
  // REAL-TIME LISTENERS (Firebase Firestore Streams)
  // ============================================================
  
  /// Listen to real-time updates from cloud
  Stream<List<T>> listenToCollection<T extends SyncableModel>(
    String collection,
    T Function(Map<String, dynamic>) fromJson,
  ) {
    return _firestore
      .collection(collection)
      .snapshots()
      .map((snapshot) {
        return snapshot.docs.map((doc) {
          return fromJson(doc.data());
        }).toList();
      });
  }
  
  /// Listen to specific document
  Stream<T?> listenToDocument<T extends SyncableModel>(
    String collection,
    String docId,
    T Function(Map<String, dynamic>) fromJson,
  ) {
    return _firestore
      .collection(collection)
      .doc(docId)
      .snapshots()
      .map((doc) {
        if (doc.exists) {
          return fromJson(doc.data()!);
        }
        return null;
      });
  }
  
  // ============================================================
  // TEACHER-STUDENT REAL-TIME SYNC
  // ============================================================
  
  /// Teacher: Listen to all students' progress
  Stream<List<StudentProgress>> listenToStudentsProgress(String teacherId) {
    return _firestore
      .collection('studentProgress')
      .where('teacherId', isEqualTo: teacherId)
      .snapshots()
      .map((snapshot) {
        return snapshot.docs.map((doc) {
          return StudentProgress.fromJson(doc.data());
        }).toList();
      });
  }
  
  /// Student: Receive real-time assignments from teacher
  Stream<List<Assignment>> listenToAssignments(String studentId) {
    return _firestore
      .collection('assignments')
      .where('studentIds', arrayContains: studentId)
      .snapshots()
      .map((snapshot) {
        return snapshot.docs.map((doc) {
          return Assignment.fromJson(doc.data());
        }).toList();
      });
  }
  
  // ============================================================
  // PULL TO REFRESH (Manual Sync)
  // ============================================================
  
  Future<void> pullLatestData(String collection) async {
    if (!_isOnline) {
      throw Exception('Cannot pull data while offline');
    }
    
    try {
      final snapshot = await _firestore.collection(collection).get();
      
      for (var doc in snapshot.docs) {
        final data = _parseDocument(doc);
        
        // Save to local database
        await LocalDatabase.save(collection, doc.id, data);
      }
      
      print('✅ Pulled latest data for $collection');
    } catch (e) {
      print('❌ Failed to pull data: $e');
      rethrow;
    }
  }
  
  // ============================================================
  // UTILITIES
  // ============================================================
  
  T _parseDocument<T>(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    
    // Parse based on type
    // This is a simplified version - implement proper parsing
    switch (T) {
      case UserProfile:
        return UserProfile.fromJson(data) as T;
      case LearningSession:
        return LearningSession.fromJson(data) as T;
      // ... handle other types
      default:
        throw Exception('Unknown type: $T');
    }
  }
  
  bool get isOnline => _isOnline;
  bool get isSyncing => _isSyncing;
  
  void dispose() {
    _connectivitySubscription?.cancel();
    _syncTimer?.cancel();
  }
}

// ============================================================
// HELPER CLASSES
// ============================================================

class SyncOperation<T extends SyncableModel> {
  final T data;
  final String collection;
  final OperationType type;
  
  SyncOperation(this.data, this.collection, this.type);
}

enum OperationType {
  create,
  update,
  delete,
}
```

---

### Step 5: UI Integration

#### Sync Status Indicator Widget
```dart
// lib/widgets/sync_status_indicator.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SyncStatusIndicator extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final syncController = ref.watch(syncControllerProvider);
    
    if (!syncController.isOnline) {
      return Container(
        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.orange,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.cloud_off, size: 16, color: Colors.white),
            SizedBox(width: 4),
            Text('Offline', style: TextStyle(color: Colors.white, fontSize: 12)),
          ],
        ),
      );
    }
    
    if (syncController.isSyncing) {
      return Container(
        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.blue,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: 12,
              height: 12,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation(Colors.white),
              ),
            ),
            SizedBox(width: 6),
            Text('Syncing...', style: TextStyle(color: Colors.white, fontSize: 12)),
          ],
        ),
      );
    }
    
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.green,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.cloud_done, size: 16, color: Colors.white),
          SizedBox(width: 4),
          Text('Synced', style: TextStyle(color: Colors.white, fontSize: 12)),
        ],
      ),
    );
  }
}
```

#### Pull-to-Refresh
```dart
// In any list screen
RefreshIndicator(
  onRefresh: () async {
    final syncController = ref.read(syncControllerProvider);
    await syncController.syncAll();
  },
  child: ListView.builder(
    // ... your list items
  ),
)
```

---

## 🗄️ SUPABASE IMPLEMENTATION (Alternative)

### Step 1: Setup Supabase

#### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Create new project: "EduFlow"
3. Note your API URL and anon key

#### 1.2 Configure Flutter App
```yaml
# pubspec.yaml
dependencies:
  supabase_flutter: ^2.0.0
  connectivity_plus: ^5.0.2
```

#### 1.3 Initialize Supabase
```dart
// lib/main.dart
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Supabase.initialize(
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_ANON_KEY',
  );
  
  runApp(MyApp());
}

final supabase = Supabase.instance.client;
```

---

### Step 2: Database Schema (Supabase SQL)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sync_version INTEGER DEFAULT 1,
  device_id TEXT
);

-- Learning DNA table
CREATE TABLE learning_dna (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  processing_speed TEXT,
  concept_retention TEXT,
  error_pattern TEXT,
  focus_pattern TEXT,
  learning_style TEXT,
  reaction_time_baseline INTEGER,
  recovery_speed TEXT,
  cognitive_load_threshold INTEGER,
  optimal_session_length INTEGER,
  peak_performance_time TEXT,
  learns_better_with TEXT,
  struggle_triggers JSONB,
  success_patterns JSONB,
  adaptability FLOAT,
  growth_rate FLOAT,
  consistency_score FLOAT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  total_learning_time INTEGER DEFAULT 0,
  data_points INTEGER DEFAULT 0,
  sync_version INTEGER DEFAULT 1,
  device_id TEXT,
  UNIQUE(user_id)
);

-- Learning Sessions table
CREATE TABLE learning_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  difficulty_level TEXT,
  cognitive_load_avg FLOAT,
  focus_level_avg FLOAT,
  strategy_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sync_version INTEGER DEFAULT 1,
  device_id TEXT
);

-- Cognitive States table (real-time snapshots)
CREATE TABLE cognitive_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES learning_sessions(id) ON DELETE CASCADE,
  reaction_times JSONB,
  avg_reaction_time FLOAT,
  error_history JSONB,
  error_pattern TEXT,
  performance_history JSONB,
  consistency_score FLOAT,
  trend_direction TEXT,
  current_cognitive_load FLOAT,
  focus_level FLOAT,
  fatigue_level FLOAT,
  questions_in_session INTEGER,
  correct_in_row INTEGER,
  wrong_in_row INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  sync_version INTEGER DEFAULT 1,
  device_id TEXT
);

-- Memory Strength table
CREATE TABLE memory_strengths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL,
  strength TEXT,
  strength_score FLOAT,
  last_reviewed TIMESTAMPTZ,
  next_optimal_review TIMESTAMPTZ,
  review_count INTEGER DEFAULT 0,
  decay_rate FLOAT,
  retrieval_success FLOAT,
  interference_factors JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sync_version INTEGER DEFAULT 1,
  device_id TEXT,
  UNIQUE(user_id, concept_id)
);

-- Achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  sync_version INTEGER DEFAULT 1,
  device_id TEXT
);

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sync_version INTEGER DEFAULT 1,
  device_id TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_strengths ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own learning_dna" ON learning_dna
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning_dna" ON learning_dna
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning_dna" ON learning_dna
  FOR UPDATE USING (auth.uid() = user_id);

-- Similar policies for other tables...

-- Create indexes for performance
CREATE INDEX idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX idx_cognitive_states_user_id ON cognitive_states(user_id);
CREATE INDEX idx_memory_strengths_user_id ON memory_strengths(user_id);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE learning_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE cognitive_states;
ALTER PUBLICATION supabase_realtime ADD TABLE achievements;
```

---

### Step 3: Supabase Sync Controller

```dart
// lib/services/supabase_sync_controller.dart
import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseSyncController {
  final SupabaseClient _client = Supabase.instance.client;
  
  // Similar structure to Firebase SyncController
  // but use Supabase methods instead
  
  Future<void> saveData<T extends SyncableModel>(
    T data,
    String table,
  ) async {
    // Save locally first
    await LocalDatabase.save(table, data.id, data);
    
    // Sync to Supabase
    if (_isOnline) {
      try {
        await _client
          .from(table)
          .upsert(data.toJson())
          .eq('id', data.id);
          
        data.syncStatus = 'synced';
        await LocalDatabase.save(table, data.id, data);
      } catch (e) {
        print('Failed to sync: $e');
      }
    }
  }
  
  // Real-time subscription
  Stream<List<T>> listenToTable<T extends SyncableModel>(
    String table,
    T Function(Map<String, dynamic>) fromJson,
  ) {
    return _client
      .from(table)
      .stream(primaryKey: ['id'])
      .map((data) {
        return data.map((item) => fromJson(item)).toList();
      });
  }
}
```

---

## 🎯 ADVANCED SYNC FEATURES

### 1. Incremental Sync (Only Changed Data)

```dart
class IncrementalSync {
  Future<void> syncOnlyChanges() async {
    // Get last sync timestamp
    final lastSync = await _getLastSyncTimestamp();
    
    // Query only data updated after last sync
    final changes = await _firestore
      .collection('learningSessions')
      .where('updatedAt', isGreaterThan: lastSync)
      .get();
    
    for (var doc in changes.docs) {
      // Process only changed documents
      await _processChangedDocument(doc);
    }
    
    // Update last sync timestamp
    await _setLastSyncTimestamp(DateTime.now());
  }
}
```

### 2. Batch Sync (Reduce Network Calls)

```dart
class BatchSync {
  Future<void> syncInBatches() async {
    final batch = _firestore.batch();
    final pendingData = _getPendingData();
    
    for (var data in pendingData) {
      final docRef = _firestore.collection(data.collection).doc(data.id);
      batch.set(docRef, data.toJson());
    }
    
    await batch.commit();
  }
}
```

### 3. Compression for Large Data

```dart
import 'dart:convert';
import 'package:archive/archive.dart';

class DataCompression {
  String compress(Map<String, dynamic> data) {
    final jsonString = jsonEncode(data);
    final bytes = utf8.encode(jsonString);
    final compressed = GZipEncoder().encode(bytes);
    return base64Encode(compressed!);
  }
  
  Map<String, dynamic> decompress(String compressedData) {
    final bytes = base64Decode(compressedData);
    final decompressed = GZipDecoder().decodeBytes(bytes);
    final jsonString = utf8.decode(decompressed);
    return jsonDecode(jsonString);
  }
}
```

### 4. Retry Logic with Exponential Backoff

```dart
class RetrySync {
  Future<void> syncWithRetry(Function syncFunction) async {
    int retries = 0;
    const maxRetries = 5;
    
    while (retries < maxRetries) {
      try {
        await syncFunction();
        return; // Success
      } catch (e) {
        retries++;
        if (retries >= maxRetries) {
          throw Exception('Max retries exceeded');
        }
        
        // Exponential backoff: 2^retries seconds
        final delay = Duration(seconds: pow(2, retries) as int);
        await Future.delayed(delay);
      }
    }
  }
}
```

---

## 🔔 REAL-TIME NOTIFICATIONS

### Teacher → Student Notifications

```dart
class RealtimeNotifications {
  // Teacher sends assignment
  Future<void> sendAssignment(String studentId, Assignment assignment) async {
    await _firestore
      .collection('assignments')
      .doc(assignment.id)
      .set(assignment.toJson());
    
    // Trigger push notification
    await _sendPushNotification(
      studentId,
      'New Assignment',
      'You have a new assignment: ${assignment.title}',
    );
  }
  
  // Student listens for new assignments
  Stream<List<Assignment>> listenForAssignments(String studentId) {
    return _firestore
      .collection('assignments')
      .where('studentId', isEqualTo: studentId)
      .snapshots()
      .map((snapshot) {
        return snapshot.docs.map((doc) {
          return Assignment.fromJson(doc.data());
        }).toList();
      });
  }
}
```

---

## 📊 SYNC ANALYTICS & MONITORING

```dart
class SyncAnalytics {
  int totalSyncs = 0;
  int successfulSyncs = 0;
  int failedSyncs = 0;
  int totalConflicts = 0;
  
  void trackSync(bool success) {
    totalSyncs++;
    if (success) {
      successfulSyncs++;
    } else {
      failedSyncs++;
    }
  }
  
  void trackConflict() {
    totalConflicts++;
  }
  
  Map<String, dynamic> getStats() {
    return {
      'totalSyncs': totalSyncs,
      'successRate': (successfulSyncs / totalSyncs * 100).toStringAsFixed(2),
      'failedSyncs': failedSyncs,
      'totalConflicts': totalConflicts,
    };
  }
}
```

---

## ✅ TESTING SYNC FUNCTIONALITY

### Unit Tests
```dart
void main() {
  test('Save data offline and sync when online', () async {
    final controller = SyncController();
    
    // Simulate offline
    controller.setOnline(false);
    
    // Save data
    final data = UserProfile(/* ... */);
    await controller.saveData(data, 'userProfiles');
    
    // Verify saved locally
    final localData = await LocalDatabase.get('userProfiles', data.id);
    expect(localData, isNotNull);
    
    // Simulate online
    controller.setOnline(true);
    await controller.syncAll();
    
    // Verify synced
    expect(data.syncStatus, equals('synced'));
  });
}
```

---

## 🎯 IMPLEMENTATION CHECKLIST

### Phase 1: Basic Sync
- ✅ Setup Firebase/Supabase
- ✅ Configure Flutter app
- ✅ Create data models with sync metadata
- ✅ Implement local database (Hive)
- ✅ Implement basic sync controller
- ✅ Test offline-first save/load

### Phase 2: Real-time Sync
- ✅ Implement connectivity listener
- ✅ Implement auto-sync on reconnection
- ✅ Implement periodic sync
- ✅ Add sync status indicators
- ✅ Test sync across devices

### Phase 3: Conflict Resolution
- ✅ Implement version-based conflict detection
- ✅ Implement last-write-wins strategy
- ✅ Test conflict scenarios
- ✅ Add manual conflict resolution UI

### Phase 4: Advanced Features
- ✅ Implement incremental sync
- ✅ Implement batch sync
- ✅ Add retry logic
- ✅ Implement real-time listeners
- ✅ Add teacher-student real-time features

### Phase 5: Optimization
- ✅ Implement data compression
- ✅ Optimize network usage
- ✅ Add sync analytics
- ✅ Performance testing
- ✅ Security audit

---

## 🚀 FINAL PROMPT TO AI

"Implement a complete offline-first real-time sync system for EduFlow Flutter app using Firebase (or Supabase). The system should:

1. Save all data locally first (Hive/Isar)
2. Automatically sync to cloud when online
3. Handle conflicts using version-based detection
4. Support multi-device sync
5. Enable real-time updates between teachers and students
6. Include sync status indicators in UI
7. Implement retry logic with exponential backoff
8. Support incremental and batch syncing
9. Work seamlessly offline with queued operations
10. Provide pull-to-refresh functionality

Use the SyncController architecture provided above and ensure all data models extend SyncableModel with proper metadata. Test thoroughly with offline/online scenarios."

---

**Your EduFlow app is now ready for production with bulletproof sync! 🔄**
