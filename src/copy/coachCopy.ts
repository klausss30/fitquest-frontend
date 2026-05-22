import { useSyncExternalStore } from 'react'
import { LANGUAGE_STORAGE_KEY, LEGACY_LANGUAGE_STORAGE_KEY } from '../utils/storageKeys'

export type AppLanguage = 'zh-CN' | 'en-US'
export type LanguageMode = 'system' | AppLanguage

export const LANGUAGE_KEY = LANGUAGE_STORAGE_KEY
const LANGUAGE_CHANGE_EVENT = 'fitquest_language_changed'
const LEGACY_LANGUAGE_CHANGE_EVENT = 'fitbubble_language_changed'

export function resolveAppLanguage(): AppLanguage {
  const saved = localStorage.getItem(LANGUAGE_KEY) ?? localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY)
  if (saved && !localStorage.getItem(LANGUAGE_KEY)) {
    localStorage.setItem(LANGUAGE_KEY, saved)
    localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY)
  }
  if (saved === 'zh-CN' || saved === 'en-US') return saved
  const systemLanguage = navigator.language || 'zh-CN'
  return systemLanguage.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US'
}

export function readLanguageMode(): LanguageMode {
  const saved = localStorage.getItem(LANGUAGE_KEY) ?? localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY)
  return saved === 'zh-CN' || saved === 'en-US' ? saved : 'system'
}

export function writeLanguageMode(mode: LanguageMode) {
  if (mode === 'system') {
    localStorage.removeItem(LANGUAGE_KEY)
  } else {
    localStorage.setItem(LANGUAGE_KEY, mode)
  }
  localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY)
  window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT))
}

function subscribeLanguage(listener: () => void) {
  window.addEventListener(LANGUAGE_CHANGE_EVENT, listener)
  window.addEventListener(LEGACY_LANGUAGE_CHANGE_EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, listener)
    window.removeEventListener(LEGACY_LANGUAGE_CHANGE_EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}

export function useAppLanguage() {
  return useSyncExternalStore<AppLanguage>(subscribeLanguage, resolveAppLanguage, () => 'zh-CN')
}

export function useLanguageMode() {
  return useSyncExternalStore<LanguageMode>(subscribeLanguage, readLanguageMode, () => 'system')
}

export const copies = {
  zh: {
    common: {
      back: '返回',
      cancel: '取消',
      confirm: '确认',
      notSet: '未设置',
      bodyweight: '自重',
      sets: '组',
      reps: '次',
      weight: '重量',
      secondsShort: '秒',
      minutes: (value: number) => `${value} 分钟`,
      exercises: (value: number) => `${value} 个动作`,
    },
    options: {
      levels: {
        beginner: { label: '新手', desc: '刚开始训练' },
        intermediate: { label: '中级', desc: '有稳定训练习惯' },
        advanced: { label: '高级', desc: '熟悉动作和强度' },
      },
      goals: {
        muscle_gain: { label: '增肌', desc: '增加肌肉量' },
        fat_loss: { label: '减脂', desc: '控制体脂和体重' },
        strength: { label: '力量', desc: '提升主要力量表现' },
      },
      genders: {
        male: { label: '男', desc: '用于更贴合地估算训练量' },
        female: { label: '女', desc: '用于更贴合地估算训练量' },
        not_specified: { label: '暂不选择', desc: '我会按通用方案安排' },
      },
      categories: {
        warmup: '热身',
        main: '主项',
        accessory: '辅助',
        finisher: '收尾',
        cooldown: '放松',
      },
      muscleGroups: {
        auto: '智能推荐',
        legs: '腿',
        chest: '胸',
        back: '背',
        shoulders: '肩',
        arms: '手臂',
        full_body: '全身',
      },
      adjust: {
        low_energy: '减轻强度',
        high_intensity: '加大强度',
        short_time: '只有30分钟',
        swap: '更换选中的动作',
        custom: '自定义调整',
      },
      languageModes: {
        system: { label: '跟随系统', subtitle: '根据设备语言自动选择' },
        'zh-CN': { label: '中文', subtitle: '界面和 AI 内容优先使用中文' },
        'en-US': { label: 'English', subtitle: 'Prefer English for app and AI content' },
      },
    },
    home: {
      records: '训练记录',
      profile: '我的状态',
      start: '今天练一场',
      startSub: '我来带节奏',
      hint: '点中间，我们开始',
    },
    auth: {
      loginTitle: '今天也来训练一下？',
      loginLoading: '我在打开训练场...',
      loginAction: '进入训练',
      registerLink: '创建新账号',
      registerTitle: '先把账号建好',
      registerSub: '以后我会根据你的训练记录，把计划调得更贴合你。',
      registerLoading: '我在准备你的训练空间...',
      registerAction: '创建账号',
      existingAccount: '已有账号？',
      goLogin: '回来训练',
      name: '昵称',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      namePlaceholder: '你的名字',
      passwordPlaceholder: '至少 6 位',
      confirmPasswordPlaceholder: '再输一次',
      passwordMismatch: '两次输入的密码不一致',
    },
    onboarding: {
      title: '先让我了解你一点',
      subtitle: '这些信息会帮我把第一次训练安排得更合适。',
      gender: '你的性别',
      experience: '你现在的训练经验',
      goal: '这阶段先追哪个目标',
      height: '身高 cm（选填）',
      weight: '体重 kg（选填）',
      saving: '我在记下来...',
      action: '好了，开始训练',
    },
    week: {
      title: '本周训练',
      todayTitle: '今天这一练',
      todayWorkout: '今日训练',
      pending: '待安排',
      rest: '恢复日',
      done: '已完成',
      future: '待训练',
      fallbackWorkout: '今天这一练',
      cta: '我们开始吧',
      month: (value: number) => `${value}月`,
      day: (value: number) => `${value} 日`,
      dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      syncError: (message: string) => `我这边暂时没同步上：${message}`,
      coachMessages: {
        yesterday: (workout: string, previous: string) => [
          `昨天你完成了${previous}，节奏已经接上了。今天我们把重点放在${workout}，稳住动作质量，再往前推一步。`,
          `昨天的${previous}已经打好底了。今天轮到${workout}，不用猛冲，跟着节奏把每一组做稳。`,
          `你昨天已经完成一次漂亮的训练，今天继续把习惯接住。${workout}准备好了，我们把状态慢慢拉起来。`,
        ],
        many: (workout: string, count: number) => [
          `这周你已经完成了 ${count} 次训练，身体正在进入状态。今天安排${workout}，保持专注，别急着冲，做扎实就很强。`,
          `本周已经完成 ${count} 次训练了，节奏很好。今天的${workout}我们做得聪明一点，质量优先。`,
          `你这周的训练节奏已经起来了。今天继续推进${workout}，稳住呼吸，完成比完美更重要。`,
        ],
        one: (workout: string) => [
          `这周已经有一次训练打底了，今天继续把节奏养起来。先完成${workout}，让身体记住这个习惯。`,
          `本周第一步已经迈出去了。今天接上${workout}，不用想太多，开始之后身体会进入状态。`,
          `你这周已经有训练记录了，很好。今天把${workout}完成，给这一周再加一点确定感。`,
        ],
        none: (workout: string) => [
          `今天从${workout}开始，把这一周的训练节奏点亮。不用追求完美，先完成第一步就很好。`,
          `今天先把${workout}启动起来。只要开始，后面的节奏就会轻很多。`,
          `这一周从现在开始也不晚。今天完成${workout}，让身体收到一个清晰的信号。`,
          `给今天一个简单目标：进入训练，完成${workout}。剩下的，我陪你一组一组来。`,
        ],
      },
    },
    plan: {
      title: '今天这一练',
      loading: '我在看你最近的训练节奏，马上给你安排今天这一练。',
      generationFailed: '这次计划没生成出来',
      retry: '我再试一次',
      duration: (minutes: number) => `预计 ${minutes} 分钟`,
      exercisesCount: (count: number) => `${count} 个动作`,
      muscleGroup: '今天想练哪一块？',
      quickAdjust: '今天状态怎么调？',
      selectSwapFirst: '先点一下想更换的动作，我再帮你换掉它。',
      swapMessage: (names: string[]) => `请只更换这些选中的动作：${names.join('、')}。未选中的动作尽量保留。`,
      thinking: '我正在重新安排动作...',
      start: '开始训练',
    },
    workout: {
      entering: '我在帮你把训练打开。',
      missingPlan: '还没拿到今天的计划，我先带你回去重新安排。',
      unavailable: '这次还不能开始',
      noExercises: '没有可训练动作',
      backToPlan: '回到计划',
      inProgress: '我们一起练',
      finishedTitle: '今天这练拿下了',
      summary: (completed: number, skipped: number, minutes: number) =>
        `完成 ${completed} 个动作 · 跳过 ${skipped} 个 · 约 ${minutes} 分钟`,
      tooHeavyNote: (count: number) => `我记下了 ${count} 个偏重的动作，后面会用来帮你调强度。`,
      saving: '我在记录...',
      saved: '我已经帮你记好了，今天这练完成得很漂亮。',
      save: '记录这次训练',
      home: '回到首页',
      restTitle: '缓一口气',
      restSubtitle: '呼吸，喝口水',
      nextSet: '下一组准备',
      nextExerciseFallback: '训练',
      setLabel: (current: number, total: number) => `第 ${current} / ${total} 组`,
      nextSetLabel: (set: number) => `第 ${set} 组`,
      skipRest: '我准备好了',
      completeSet: '这组完成了',
      tooHeavy: '太重了',
      skipExercise: '跳过这个',
      endWorkout: '先练到这里',
      minSaveError: '至少完成 1 个动作，我才能帮你记录这次训练。',
      saveFailed: '这次记录没保存上，我再帮你试一下。',
    },
    records: {
      title: '训练回顾',
      loading: '我在翻你的训练记录...',
      errorTitle: '这次没读到记录',
      emptyTitle: '还没有保存过训练',
      emptySubtitle: '完成一场训练后，我会把它记在这里。',
      detailTitle: '这次训练',
      detailLoading: '我在打开这次训练...',
      detailErrorTitle: '这条记录暂时打不开',
      missing: '训练记录不存在',
      summary: (date: string, minutes: number, count: number) => `${date} · ${minutes} 分钟 · ${count} 个动作`,
    },
    profile: {
      title: '我的状态',
      guestName: '未登录',
    },
    settings: {
      title: '教练设置',
      profileTitle: '调整资料',
      languageTitle: '语言偏好',
      editProfile: '调整资料',
      editProfileSub: '经验、目标、身高、体重',
      language: '语言偏好',
      logout: '退出账号',
      logoutSub: '回到登录页面',
      level: '经验水平',
      goal: '训练目标',
      heightPlaceholder: '身高 cm',
      weightPlaceholder: '体重 kg',
      saved: '资料已更新',
      saveLoading: '我在更新...',
      save: '保存调整',
      chooseLevel: '选择经验水平',
      chooseGoal: '选择训练目标',
      chooseLanguage: '选择语言',
      changeLanguageTitle: '切换语言？',
      changeLanguageMessage: '切换后，新生成的训练计划和 AI 内容会使用新的语言。已有训练记录不会被翻译或修改。',
      languageNote: (label: string) => `当前选择：${label}。之后我会按这个语言生成新的训练内容。`,
    },
  },
  en: {
    common: {
      back: 'Back',
      cancel: 'Cancel',
      confirm: 'Confirm',
      notSet: 'Not set',
      bodyweight: 'Bodyweight',
      sets: 'sets',
      reps: 'reps',
      weight: 'Weight',
      secondsShort: 'sec',
      minutes: (value: number) => `${value} min`,
      exercises: (value: number) => `${value} exercises`,
    },
    options: {
      levels: {
        beginner: { label: 'Beginner', desc: 'Just getting started' },
        intermediate: { label: 'Intermediate', desc: 'Training consistently' },
        advanced: { label: 'Advanced', desc: 'Comfortable with intensity' },
      },
      goals: {
        muscle_gain: { label: 'Build muscle', desc: 'Increase muscle size' },
        fat_loss: { label: 'Fat loss', desc: 'Manage body fat and weight' },
        strength: { label: 'Strength', desc: 'Improve main lifts' },
      },
      genders: {
        male: { label: 'Male', desc: 'Helps me tune training volume' },
        female: { label: 'Female', desc: 'Helps me tune training volume' },
        not_specified: { label: 'Skip for now', desc: 'I will use a general plan' },
      },
      categories: {
        warmup: 'Warm-up',
        main: 'Main',
        accessory: 'Accessory',
        finisher: 'Finisher',
        cooldown: 'Cooldown',
      },
      muscleGroups: {
        auto: 'Smart pick',
        legs: 'Legs',
        chest: 'Chest',
        back: 'Back',
        shoulders: 'Shoulders',
        arms: 'Arms',
        full_body: 'Full body',
      },
      adjust: {
        low_energy: 'Lower intensity',
        high_intensity: 'Push harder',
        short_time: 'Only 30 minutes',
        swap: 'Swap selected moves',
        custom: 'Custom adjustment',
      },
      languageModes: {
        system: { label: 'Follow system', subtitle: 'Use your device language' },
        'zh-CN': { label: '中文', subtitle: 'Prefer Chinese for the app and AI content' },
        'en-US': { label: 'English', subtitle: 'Prefer English for the app and AI content' },
      },
    },
    home: {
      records: 'History',
      profile: 'My status',
      start: 'Train today',
      startSub: "I'll guide you",
      hint: "Tap the center. Let's go.",
    },
    auth: {
      loginTitle: 'Ready to train today?',
      loginLoading: 'Opening the training room...',
      loginAction: 'Enter training',
      registerLink: 'Create account',
      registerTitle: "Let's set up your account",
      registerSub: 'I will use your training history to make each plan fit you better.',
      registerLoading: 'Preparing your training space...',
      registerAction: 'Create account',
      existingAccount: 'Already have an account?',
      goLogin: 'Log in',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      namePlaceholder: 'Your name',
      passwordPlaceholder: 'At least 6 characters',
      confirmPasswordPlaceholder: 'Type it again',
      passwordMismatch: 'The two passwords do not match',
    },
    onboarding: {
      title: 'Let me get to know you',
      subtitle: 'These details help me make your first workout fit better.',
      gender: 'Your gender',
      experience: 'Your training experience',
      goal: 'Your current goal',
      height: 'Height cm (optional)',
      weight: 'Weight kg (optional)',
      saving: 'Saving this...',
      action: "All set. Let's train",
    },
    week: {
      title: 'This Week',
      todayTitle: "Today's training",
      todayWorkout: "Today's training",
      pending: 'Unplanned',
      rest: 'Recovery day',
      done: 'Done',
      future: 'Upcoming',
      fallbackWorkout: "today's training",
      cta: "Let's start",
      month: (value: number) => new Date(2026, value - 1, 1).toLocaleString('en-US', { month: 'short' }),
      day: (value: number) => `${value}`,
      dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      syncError: (message: string) => `I could not sync this yet: ${message}`,
      coachMessages: {
        yesterday: (workout: string, previous: string) => [
          `You completed ${previous} yesterday. Today we focus on ${workout}, keep your form clean, and move one step forward.`,
          `${previous} gave you a good base yesterday. Today is ${workout}. No need to rush; stay steady with each set.`,
          `You already showed up yesterday. Today, ${workout} is ready. Let's ease into it and build the rhythm.`,
        ],
        many: (workout: string, count: number) => [
          `You have finished ${count} sessions this week. Today is ${workout}; keep it focused and make every rep count.`,
          `${count} sessions already this week. Nice rhythm. For ${workout}, quality comes first.`,
          `Your week has momentum. Keep breathing steady and finish ${workout} one set at a time.`,
        ],
        one: (workout: string) => [
          `You already have one session banked this week. Today, finish ${workout} and keep the habit moving.`,
          `The first step is done. Now we connect it with ${workout}; once you start, the body will follow.`,
          `You have one workout in the books. Let's add ${workout} and give the week more direction.`,
        ],
        none: (workout: string) => [
          `Start this week with ${workout}. No need for perfect; just take the first step.`,
          `Let's switch on ${workout} today. Starting is the hardest part.`,
          `It is not too late to start the week now. Finish ${workout} and send your body a clear signal.`,
          `Simple goal for today: enter training and finish ${workout}. I will guide you set by set.`,
        ],
      },
    },
    plan: {
      title: "Today's training",
      loading: 'I am checking your recent rhythm and building today’s plan.',
      generationFailed: 'This plan did not come through',
      retry: 'Try again',
      duration: (minutes: number) => `Est. ${minutes} min`,
      exercisesCount: (count: number) => `${count} exercises`,
      muscleGroup: 'What should we train today?',
      quickAdjust: 'How should we tune today?',
      selectSwapFirst: 'Select the moves you want to swap, then I will replace them.',
      swapMessage: (names: string[]) => `Only swap these selected exercises: ${names.join(', ')}. Keep the unselected exercises when possible.`,
      thinking: 'I am reworking the exercises...',
      start: 'Start training',
    },
    workout: {
      entering: 'Opening your workout.',
      missingPlan: 'I do not have today’s plan yet. Let’s go back and build it again.',
      unavailable: 'We cannot start this one yet',
      noExercises: 'No exercises available',
      backToPlan: 'Back to plan',
      inProgress: "Let's train together",
      finishedTitle: 'You got this one done',
      summary: (completed: number, skipped: number, minutes: number) =>
        `Completed ${completed} exercises · Skipped ${skipped} · About ${minutes} min`,
      tooHeavyNote: (count: number) => `I noted ${count} exercises that felt heavy so we can adjust later.`,
      saving: 'Saving this...',
      saved: 'I saved it. Nice work getting this session done.',
      save: 'Save this workout',
      home: 'Back home',
      restTitle: 'Take a breath',
      restSubtitle: 'Breathe and sip water',
      nextSet: 'Next set coming up',
      nextExerciseFallback: 'Training',
      setLabel: (current: number, total: number) => `Set ${current} / ${total}`,
      nextSetLabel: (set: number) => `Set ${set}`,
      skipRest: 'I am ready',
      completeSet: 'Set complete',
      tooHeavy: 'Too heavy',
      skipExercise: 'Skip this',
      endWorkout: 'Stop here',
      minSaveError: 'Complete at least 1 exercise before I can save this workout.',
      saveFailed: 'This workout did not save. Let’s try again.',
    },
    records: {
      title: 'Training History',
      loading: 'Looking through your workouts...',
      errorTitle: 'I could not load history',
      emptyTitle: 'No saved workouts yet',
      emptySubtitle: 'After you finish and save a workout, I will keep it here.',
      detailTitle: 'Workout Detail',
      detailLoading: 'Opening this workout...',
      detailErrorTitle: 'This record will not open right now',
      missing: 'Training record not found',
      summary: (date: string, minutes: number, count: number) => `${date} · ${minutes} min · ${count} exercises`,
    },
    profile: {
      title: 'My Status',
      guestName: 'Not logged in',
    },
    settings: {
      title: 'Coach Settings',
      profileTitle: 'Edit Profile',
      languageTitle: 'Language',
      editProfile: 'Edit Profile',
      editProfileSub: 'Experience, goal, height, weight',
      language: 'Language',
      logout: 'Log out',
      logoutSub: 'Return to login',
      level: 'Experience level',
      goal: 'Training goal',
      heightPlaceholder: 'Height cm',
      weightPlaceholder: 'Weight kg',
      saved: 'Profile updated',
      saveLoading: 'Updating...',
      save: 'Save changes',
      chooseLevel: 'Choose experience level',
      chooseGoal: 'Choose training goal',
      chooseLanguage: 'Choose language',
      changeLanguageTitle: 'Change language?',
      changeLanguageMessage: 'New workout plans and AI content will use the new language. Existing training records will not be translated or changed.',
      languageNote: (label: string) => `Current choice: ${label}. I will use this language for new training content.`,
    },
  },
}

export type CoachCopy = typeof copies.zh

export function getCoachCopy(language: AppLanguage): CoachCopy {
  return language === 'en-US' ? copies.en : copies.zh
}

export function useCoachCopy() {
  return getCoachCopy(useAppLanguage())
}

export const coachCopy = copies.zh
