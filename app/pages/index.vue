<script setup lang="ts">
import DoctorListRow from '~/modules/doctor/components/DoctorListRow.vue'
import FilterChip from '~/modules/doctor/components/FilterChip.vue'
import type { Doctor } from '~/modules/doctor/types'

const { t } = useI18n()
const route = useRoute()

useHead({ title: computed(() => t('meta.home')) })

// ── View mode ─────────────────────────────────────────────────────────
const chatMode = computed(() => route.query.view === 'chat')

// ── Filter state (shared) ─────────────────────────────────────────────
const filterChipKeys = ['all', 'cardiology', 'pediatrics', 'orthopedics', 'dermatology', 'ent'] as const
const activeFilterKey = ref<(typeof filterChipKeys)[number]>('all')

const sidebarSpecialtyKeys = ['cardiology', 'pediatrics', 'orthopedics', 'dermatology', 'ent', 'ophthalmology', 'neurology'] as const
const selectedSpecialties = ref<string[]>([])

const activeAvailabilityIdx = ref(0)

const ratingOptions = computed(() => [
  { label: t('home.fiveStars'), value: 5 },
  { label: t('home.fourPlus'), value: 4 },
  { label: t('home.threePlus'), value: 3 },
])
const activeRating = ref(5)
const filterTelemedicine = ref(false)
const filterFollowup = ref(false)
const activeSortIdx = ref(0)

// ── Doctor list state ─────────────────────────────────────────────────
const currentPage = ref(1)
const totalPages = 6
const searchQuery = ref('')

const availabilityLabels = computed(() => [
  t('home.anyTime'), t('home.today'), t('home.tomorrow'), t('home.thisWeek'),
])
const sortLabels = computed(() => [
  t('home.relevance'), t('home.rating'), t('home.priceLow'),
])

const chipsRef = ref<HTMLElement | null>(null)
const pgNumbersRef = ref<HTMLElement | null>(null)
const resultsListRef = ref<HTMLElement | null>(null)

function scrollChips(dir: number) {
  if (!chipsRef.value) return
  chipsRef.value.scrollBy({ left: dir * 150, behavior: 'smooth' })
}

function scrollPaginationActiveIntoView() {
  const container = pgNumbersRef.value
  const active = container?.querySelector<HTMLElement>('.pg-btn.active')
  if (!container || !active) return
  const left = active.offsetLeft - container.clientWidth / 2 + active.offsetWidth / 2
  container.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
}

async function goToPage(p: number) {
  if (p < 1 || p > totalPages) return
  currentPage.value = p
  await nextTick()
  if (import.meta.client) {
    resultsListRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  scrollPaginationActiveIntoView()
}

const pageNumbers = computed(() => {
  const pages: (number | '…')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }
  pages.push(1)
  if (currentPage.value > 3) pages.push('…')
  const start = Math.max(2, currentPage.value - 1)
  const end = Math.min(totalPages - 1, currentPage.value + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (currentPage.value < totalPages - 2) pages.push('…')
  pages.push(totalPages)
  return pages
})

const doctors: Doctor[] = [
  { id: '1', name: 'Dr. Sara Ahmed',  specialty: 'cardiologist', clinic: 'ainShams',      rating: 5, availability: 'today',    fee: '350 EGP', experience: 12, about: 'Board-certified cardiologist at Ain Shams Hospital.', location: 'Ain Shams Hospital, Abbassia, Cairo', patients: '1,200+', languages: ['arabic', 'english'], image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&q=80', procedures: ['echo', 'stress', 'angio', 'holter'], telemedicine: true,  followup: true  },
  { id: '2', name: 'Dr. Omar Fawzy',  specialty: 'pediatrician', clinic: 'maadiChildren', rating: 4, availability: 'today',    fee: '200 EGP', experience: 8,  location: 'Maadi, Cairo',                                   patients: '850+',   languages: ['arabic'],           image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&q=80', procedures: ['vax', 'growth', 'newborn'],            telemedicine: true,  followup: false },
  { id: '3', name: 'Dr. Nour Khalil', specialty: 'dermatologist', clinic: 'cairoSkin',    rating: 4, availability: 'tomorrow', fee: '280 EGP', experience: 6,  location: 'Heliopolis, Cairo',                              patients: '600+',   languages: ['arabic', 'english'], image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&q=80', procedures: ['laser', 'peel', 'acne', 'mole'],      telemedicine: false, followup: true  },
  { id: '4', name: 'Dr. Amr Hassan',  specialty: 'orthopedic',   clinic: 'cleopatra',     rating: 5, availability: 'today',    fee: '450 EGP', experience: 15, location: 'Cleopatra Hospital, Heliopolis, Cairo',           patients: '2,000+', languages: ['arabic', 'english'], image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&q=80', procedures: ['joint', 'arth', 'fracture', 'sports'], telemedicine: false, followup: true  },
]

// ── Chat state ────────────────────────────────────────────────────────
interface ChatContact {
  id: string; name: string; specialty: string; rating: number
  online: boolean; lastMsg: string; lastTime: string; unread: number; image: string
}

const chatContacts = ref<ChatContact[]>([
  { id: '1', name: 'Dr. Sara Ahmed',    specialty: 'Cardiologist',      rating: 5, online: true,  lastMsg: 'Hello! How can I assist you today?',          lastTime: '2m',        unread: 2, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&q=80'  },
  { id: '2', name: 'Dr. Omar Fawzy',    specialty: 'Pediatrician',       rating: 4, online: false, lastMsg: 'Thank you! See you at the next appointment.',  lastTime: '1h',        unread: 0, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&q=80' },
  { id: '3', name: 'Dr. Nour Khalil',   specialty: 'Dermatologist',      rating: 4, online: true,  lastMsg: 'Please apply the cream twice daily.',          lastTime: '3h',        unread: 1, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&q=80' },
  { id: '4', name: 'Dr. Amr Hassan',    specialty: 'Orthopedic Surgeon', rating: 5, online: false, lastMsg: 'Your X-ray results look great!',               lastTime: 'Yesterday', unread: 0, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&q=80' },
  { id: '5', name: 'Dr. Layla Mostafa', specialty: 'Neurologist',        rating: 5, online: true,  lastMsg: "I'll send you the prescription shortly.",      lastTime: '2d',        unread: 0, image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&q=80' },
  { id: '6', name: 'Dr. Khaled Nour',   specialty: 'Ophthalmologist',    rating: 4, online: false, lastMsg: 'Remember to use the eye drops as directed.',   lastTime: '3d',        unread: 0, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&q=80' },
])

const selectedContact = ref<ChatContact | null>(null)
const mobileShowChat = ref(false)
const contactSearch = ref('')
const newMessage = ref('')
const messagesEndRef = ref<HTMLElement | null>(null)

const filteredContacts = computed(() => {
  const q = contactSearch.value.toLowerCase()
  if (!q) return chatContacts.value
  return chatContacts.value.filter(c =>
    c.name.toLowerCase().includes(q) || c.specialty.toLowerCase().includes(q),
  )
})

// ── Message schema ────────────────────────────────────────────────────
type MessageType = 'text' | 'attachment-request' | 'attachment-received'

interface AttachmentRequestPayload {
  docType: 'ct-scan' | 'medical-lab-result'
  label: string
  tab: string
  patientId: string
  fulfilled: boolean
}

interface AttachmentReceivedPayload {
  docType: 'ct-scan' | 'medical-lab-result'
  label: string
  tab: string
  fileName: string
}

interface ChatMessage {
  id: string
  type?: MessageType
  text: string
  from: 'me' | 'doctor'
  time: string
  attachmentRequest?: AttachmentRequestPayload
  attachmentReceived?: AttachmentReceivedPayload
}

// ── Template / attachment-request state ───────────────────────────────
const ATTACHMENT_TYPES = [
  { type: 'ct-scan' as const,           label: 'CT Scan',            tab: 'scans',         icon: '🫁' },
  { type: 'medical-lab-result' as const, label: 'Medical Lab Result', tab: 'prescriptions', icon: '🧪' },
]

const templateMenuOpen    = ref(false)
const attachmentModalOpen = ref(false)
const selectedDocType     = ref<'ct-scan' | 'medical-lab-result' | null>(null)

function openAttachmentModal() {
  templateMenuOpen.value    = false
  attachmentModalOpen.value = true
  selectedDocType.value     = null
}

function sendAttachmentRequest() {
  if (!selectedDocType.value || !selectedContact.value) return

  const typeInfo  = ATTACHMENT_TYPES.find(t => t.type === selectedDocType.value)!
  const contactId = selectedContact.value.id
  const docType   = selectedDocType.value   // capture before reset

  if (!allConversations[contactId]) allConversations[contactId] = []

  const requestMsg: ChatMessage = {
    id:   `m${Date.now()}`,
    type: 'attachment-request',
    text: `Please upload your ${typeInfo.label}.`,
    from: 'me',
    time: 'Just now',
    attachmentRequest: {
      docType,
      label:     typeInfo.label,
      tab:       typeInfo.tab,
      patientId: contactId,
      fulfilled: false,
    },
  }

  allConversations[contactId].push(requestMsg)
  selectedContact.value.lastMsg  = requestMsg.text
  selectedContact.value.lastTime = 'Just now'

  attachmentModalOpen.value = false
  selectedDocType.value     = null

  nextTick(() => { messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' }) })

  // Mock: patient uploads after 4 seconds → triggers "New Attachment" callback
  if (import.meta.client) {
    setTimeout(() => {
      const contact = chatContacts.value.find(c => c.id === contactId)

      // Mark the pending request as fulfilled
      const pending = allConversations[contactId]?.find(
        m => m.type === 'attachment-request'
          && m.attachmentRequest?.docType === docType
          && !m.attachmentRequest.fulfilled,
      )
      if (pending?.attachmentRequest) pending.attachmentRequest.fulfilled = true

      const receivedMsg: ChatMessage = {
        id:   `m${Date.now()}`,
        type: 'attachment-received',
        text: `New Attachment: ${typeInfo.label} has been uploaded.`,
        from: 'doctor',
        time: 'Just now',
        attachmentReceived: {
          docType,
          label:    typeInfo.label,
          tab:      typeInfo.tab,
          fileName: `${typeInfo.label.replace(/ /g, '_')}_report.pdf`,
        },
      }

      allConversations[contactId].push(receivedMsg)

      if (selectedContact.value?.id === contactId) {
        selectedContact.value.lastMsg  = `📎 ${typeInfo.label} uploaded`
        selectedContact.value.lastTime = 'Just now'
        nextTick(() => { messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' }) })
      } else if (contact) {
        contact.lastMsg  = `📎 ${typeInfo.label} uploaded`
        contact.lastTime = 'Just now'
        contact.unread  += 1
      }
    }, 4000)
  }
}

const allConversations: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'm1', text: 'Hello Dr. Sara, I have been experiencing chest tightness for a few days.', from: 'me',     time: '10:30 AM' },
    { id: 'm2', text: 'Hello! I am sorry to hear that. How long have you been experiencing this?', from: 'doctor', time: '10:32 AM' },
    { id: 'm3', text: 'About 3 days now. It gets worse during any physical activity.',              from: 'me',     time: '10:33 AM' },
    { id: 'm4', text: 'This could be blood pressure related. Can you come in for a check-up tomorrow?', from: 'doctor', time: '10:35 AM' },
    { id: 'm5', text: 'Yes, I can come in tomorrow afternoon.',                                     from: 'me',     time: '10:36 AM' },
    { id: 'm6', text: 'Hello! How can I assist you today?',                                         from: 'doctor', time: '2m ago'   },
  ],
  '2': [
    { id: 'm1', text: 'Doctor, my child has a fever of 38.5°C since yesterday.',       from: 'me',     time: 'Yesterday 9:00 AM' },
    { id: 'm2', text: 'Give paracetamol every 6 hours and ensure plenty of fluids.',   from: 'doctor', time: 'Yesterday 9:05 AM' },
    { id: 'm3', text: 'Thank you so much doctor!',                                      from: 'me',     time: 'Yesterday 9:10 AM' },
    { id: 'm4', text: 'Thank you! See you at the next appointment.',                    from: 'doctor', time: '1h ago'            },
  ],
  '3': [
    { id: 'm1', text: 'Dr. Nour, the redness on my skin is still not improving.',       from: 'me',     time: '3h ago' },
    { id: 'm2', text: 'Please apply the cream twice daily and avoid direct sun exposure.', from: 'doctor', time: '3h ago' },
  ],
}

const activeMessages = computed<ChatMessage[]>(() =>
  selectedContact.value ? (allConversations[selectedContact.value.id] ?? []) : [],
)

function selectContact(c: ChatContact) {
  selectedContact.value = c
  mobileShowChat.value = true
  c.unread = 0
  nextTick(() => {
    messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

function sendMessage() {
  if (!newMessage.value.trim() || !selectedContact.value) return
  const id = selectedContact.value.id
  if (!allConversations[id]) allConversations[id] = []
  allConversations[id].push({ id: `m${Date.now()}`, text: newMessage.value, from: 'me', time: 'Just now' })
  selectedContact.value.lastMsg = newMessage.value
  selectedContact.value.lastTime = 'Just now'
  newMessage.value = ''
  nextTick(() => { messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' }) })
}
</script>

<template>
  <div class="page">
    <AppNavBar />

    <!-- Mobile: search + filter chips — hidden in chat mode -->
    <div v-show="!chatMode" class="mobile-search-bar">
      <div class="search-input">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input v-model="searchQuery" :placeholder="t('home.searchMobile')" />
      </div>
      <div class="chips-wrap">
        <button class="chips-arrow" aria-label="previous" @click="scrollChips(-1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <div ref="chipsRef" class="filter-chips">
          <FilterChip
            v-for="key in filterChipKeys"
            :key="key"
            :label="key === 'all' ? t('filter.all') : t(`filter.${key}`)"
            :active="activeFilterKey === key"
            @click="activeFilterKey = key"
          />
        </div>
        <button class="chips-arrow" aria-label="next" @click="scrollChips(1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
    </div>

    <!-- Mobile chat header -->
    <div v-if="chatMode" class="mobile-chat-topbar">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue-m)" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>Chat with Doctor</span>
    </div>

    <!-- Desktop: content with sidebar -->
    <div class="content-area">

      <!-- Sidebar (always visible) -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <span class="section-label">{{ t('home.specialty') }}</span>
          <MultiCombobox
            v-model="selectedSpecialties"
            :options="sidebarSpecialtyKeys.map(k => ({ value: k, label: t(`filter.${k}`) }))"
            :placeholder="t('home.specialty')"
            :search-placeholder="t('home.searchMobile')"
          />
        </div>
        <div class="sidebar-divider" />
        <div class="sidebar-section">
          <span class="section-label">{{ t('home.availability') }}</span>
          <label v-for="(a, i) in availabilityLabels" :key="a" class="sidebar-check">
            <span class="radio" :class="{ checked: activeAvailabilityIdx === i }" @click="activeAvailabilityIdx = i" />
            <span class="sidebar-item-text">{{ a }}</span>
          </label>
        </div>
        <div class="sidebar-divider" />
        <div class="sidebar-section">
          <span class="section-label">{{ t('home.consultationType') }}</span>
          <label class="sidebar-check">
            <span class="checkbox" :class="{ checked: filterTelemedicine }" @click="filterTelemedicine = !filterTelemedicine">
              <svg v-if="filterTelemedicine" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8" stroke-linecap="round" /></svg>
            </span>
            <span class="sidebar-item-text"><span class="consult-icon">📹</span> {{ t('home.telemedicine') }}</span>
          </label>
          <label class="sidebar-check">
            <span class="checkbox" :class="{ checked: filterFollowup }" @click="filterFollowup = !filterFollowup">
              <svg v-if="filterFollowup" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8" stroke-linecap="round" /></svg>
            </span>
            <span class="sidebar-item-text"><span class="consult-icon">🔁</span> {{ t('home.followUpVisits') }}</span>
          </label>
        </div>
        <div class="sidebar-divider" />
        <div class="sidebar-section">
          <span class="section-label">{{ t('home.ratingLabel') }}</span>
          <label v-for="r in ratingOptions" :key="r.value" class="sidebar-check">
            <span class="radio" :class="{ checked: activeRating === r.value }" @click="activeRating = r.value" />
            <StarRating :value="r.value" :size="11" />
            <span class="sidebar-item-text">{{ r.label }}</span>
          </label>
        </div>
      </aside>

      <!-- Main area -->
      <div class="main">

        <!-- ── List mode header ── -->
        <div v-if="!chatMode" class="main-header">
          <div class="desktop-search-bar">
            <div class="search-input desktop">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input v-model="searchQuery" :placeholder="t('home.searchDesktop')" />
            </div>
            <button class="search-btn">{{ t('home.searchBtn') }}</button>
          </div>
          <div class="results-header">
            <span class="results-count">
              <span class="mobile-count">24 {{ t('home.doctorsFound') }}</span>
              <span class="desktop-count">{{ t('home.showing') }} <strong>24 {{ t('home.doctors') }}</strong> {{ t('home.inCairo') }}</span>
            </span>
            <div class="sort-row">
              <button class="sort-filter-btn mobile-only">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.5">
                  <line x1="4" y1="6" x2="11" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="13" y1="18" x2="20" y2="18" />
                </svg>
                {{ t('home.sortFilter') }}
              </button>
              <div class="sort-tabs desktop-only">
                <button v-for="(s, i) in sortLabels" :key="s" class="sort-tab" :class="{ active: activeSortIdx === i }" @click="activeSortIdx = i">{{ s }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Chat mode header ── -->
        <div v-else class="main-header chat-mode-header">
          <div class="chat-search-bar">
            <div class="chat-search-input">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input v-model="contactSearch" placeholder="Search doctors..." />
            </div>
            <span class="chat-count">{{ filteredContacts.length }} conversations</span>
          </div>
        </div>

        <!-- ── Doctor list view ── -->
        <div v-if="!chatMode" class="main-scroll">
          <div ref="resultsListRef" class="results-list">
            <DoctorListRow v-for="doc in doctors" :key="doc.id" :doctor="doc" />
          </div>
          <div class="pagination">
            <button class="pg-arrow" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <div ref="pgNumbersRef" class="pg-numbers">
              <template v-for="p in pageNumbers" :key="p">
                <span v-if="p === '…'" class="pg-ellipsis">…</span>
                <button v-else class="pg-btn" :class="{ active: currentPage === p }" @click="goToPage(p as number)">{{ p }}</button>
              </template>
            </div>
            <button class="pg-arrow" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        <!-- ── Chat / Messenger view ── -->
        <div v-else class="chat-panel" :class="{ 'mobile-chat-active': mobileShowChat }">

          <!-- Left: contacts list (this is the ONLY scrollable part) -->
          <div class="contacts-pane">
            <div v-if="filteredContacts.length === 0" class="contacts-empty">No doctors found.</div>
            <div
              v-for="c in filteredContacts"
              :key="c.id"
              class="contact-row"
              :class="{ active: selectedContact?.id === c.id }"
              @click="selectContact(c)"
            >
              <!-- Avatar + online dot -->
              <div class="contact-avatar-wrap">
                <img class="contact-avatar" :src="c.image" :alt="c.name" />
                <span class="online-dot" :class="{ online: c.online, offline: !c.online }" />
              </div>

              <!-- Info -->
              <div class="contact-info">
                <div class="contact-name-row">
                  <span class="contact-name">{{ c.name }}</span>
                  <span class="contact-time">{{ c.lastTime }}</span>
                </div>
                <div class="contact-sub-row">
                  <span class="contact-specialty">{{ c.specialty }}</span>
                  <span v-if="c.unread" class="unread-badge">{{ c.unread }}</span>
                </div>
                <div class="contact-rating-row">
                  <StarRating :value="c.rating" :size="10" />
                  <span class="contact-status-label" :class="{ 'is-online': c.online }">
                    {{ c.online ? 'Online' : 'Offline' }}
                  </span>
                </div>
                <p class="contact-last-msg">{{ c.lastMsg }}</p>
              </div>
            </div>
          </div>

          <!-- Right: chat window (does NOT scroll as a whole) -->
          <div class="chat-window">

            <!-- No conversation selected -->
            <div v-if="!selectedContact" class="cw-empty">
              <div class="cw-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p class="cw-empty-title">Select a doctor to start chatting</p>
              <p class="cw-empty-sub">Choose a conversation from the list on the left.</p>
            </div>

            <!-- Active conversation -->
            <template v-else>

              <!-- Chat header -->
              <div class="cw-header">
                <button class="cw-back" @click="mobileShowChat = false">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <img class="cw-avatar" :src="selectedContact.image" :alt="selectedContact.name" />
                <div class="cw-doctor-info">
                  <span class="cw-doctor-name">{{ selectedContact.name }}</span>
                  <span class="cw-doctor-spec">{{ selectedContact.specialty }}</span>
                </div>
                <span class="cw-status" :class="{ online: selectedContact.online }">
                  <span class="cw-status-dot" />
                  {{ selectedContact.online ? 'Online' : 'Offline' }}
                </span>
              </div>

              <!-- Messages (scrollable area) -->
              <div class="cw-messages">
                <div v-if="activeMessages.length === 0" class="cw-no-messages">
                  Say hello to {{ selectedContact.name }}!
                </div>
                <div
                  v-for="msg in activeMessages"
                  :key="msg.id"
                  class="msg-row"
                  :class="msg.from === 'me' ? 'msg-me' : 'msg-doctor'"
                >
                  <img v-if="msg.from === 'doctor'" class="msg-avatar" :src="selectedContact.image" :alt="selectedContact.name" />
                  <div class="msg-content">

                    <!-- Plain text -->
                    <div
                      v-if="!msg.type || msg.type === 'text'"
                      class="msg-bubble"
                      :class="msg.from === 'me' ? 'bubble-me' : 'bubble-doctor'"
                    >
                      {{ msg.text }}
                    </div>

                    <!-- Attachment request (sent by doctor) -->
                    <div v-else-if="msg.type === 'attachment-request'" class="msg-bubble bubble-me bubble-ar">
                      <div class="ar-header">
                        <span class="ar-icon">📎</span>
                        <span class="ar-label">{{ msg.attachmentRequest!.label }} Request</span>
                        <span v-if="msg.attachmentRequest!.fulfilled" class="ar-fulfilled">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                          Uploaded
                        </span>
                      </div>
                      <p class="ar-text">{{ msg.text }}</p>
                      <NuxtLink
                        :to="`/patient/${msg.attachmentRequest!.patientId}?tab=${msg.attachmentRequest!.tab}`"
                        class="ar-link"
                      >
                        Open Patient Profile →
                      </NuxtLink>
                    </div>

                    <!-- Attachment received (patient upload callback) -->
                    <div v-else-if="msg.type === 'attachment-received'" class="msg-bubble bubble-doctor bubble-recv">
                      <div class="recv-header">
                        <span class="recv-icon">📂</span>
                        <span class="recv-new">New Attachment</span>
                      </div>
                      <span class="recv-filename">{{ msg.attachmentReceived!.fileName }}</span>
                      <span class="recv-type">{{ msg.attachmentReceived!.label }}</span>
                      <NuxtLink
                        :to="`/patient/${selectedContact.id}?tab=${msg.attachmentReceived!.tab}`"
                        class="recv-view"
                      >
                        View in Profile →
                      </NuxtLink>
                    </div>

                    <span class="msg-time">{{ msg.time }}</span>
                  </div>
                </div>
                <div ref="messagesEndRef" />
              </div>

              <!-- Input bar -->
              <div class="cw-input-bar">

                <!-- Template picker -->
                <div class="tpl-wrap">
                  <button
                    class="cw-tpl-btn"
                    :class="{ active: templateMenuOpen }"
                    title="Message templates"
                    @click="templateMenuOpen = !templateMenuOpen"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <line x1="10" y1="9" x2="8" y2="9"/>
                    </svg>
                  </button>
                  <!-- Backdrop to close on outside click -->
                  <div v-if="templateMenuOpen" class="tpl-backdrop" @click="templateMenuOpen = false" />
                  <div v-if="templateMenuOpen" class="tpl-dropdown">
                    <p class="tpl-dropdown-label">Templates</p>
                    <button class="tpl-item" @click="openAttachmentModal">
                      <span class="tpl-item-icon">📎</span>
                      <div class="tpl-item-body">
                        <span class="tpl-item-name">Request Attachment</span>
                        <span class="tpl-item-sub">Ask patient to upload a document</span>
                      </div>
                    </button>
                  </div>
                </div>

                <button class="cw-attach-btn" title="Attach file">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
                <input
                  v-model="newMessage"
                  class="cw-input"
                  placeholder="Type a message..."
                  @keyup.enter="sendMessage"
                />
                <button class="cw-send-btn" :class="{ active: newMessage.trim() }" @click="sendMessage">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>

            </template>
          </div>

        </div>
      </div>
    </div>
  </div>
<!-- ── Attachment Request Modal ──────────────────────────────────────── -->
<Teleport to="body">
  <div v-if="attachmentModalOpen" class="modal-overlay" @click.self="attachmentModalOpen = false">
    <div class="modal-card">

      <div class="modal-head">
        <h3 class="modal-title">Request Attachment</h3>
        <button class="modal-close" @click="attachmentModalOpen = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <p class="modal-sub">Select the type of document to request from the patient.</p>

      <div class="modal-options">
        <button
          v-for="atype in ATTACHMENT_TYPES"
          :key="atype.type"
          class="modal-option"
          :class="{ selected: selectedDocType === atype.type }"
          @click="selectedDocType = atype.type"
        >
          <span class="opt-icon">{{ atype.icon }}</span>
          <span class="opt-label">{{ atype.label }}</span>
          <span class="opt-check" aria-hidden="true">
            <svg v-if="selectedDocType === atype.type" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
          </span>
        </button>
      </div>

      <div class="modal-footer">
        <button class="modal-cancel" @click="attachmentModalOpen = false">Cancel</button>
        <button
          class="modal-send"
          :disabled="!selectedDocType"
          @click="sendAttachmentRequest"
        >
          Send Request
        </button>
      </div>

    </div>
  </div>
</Teleport>
</template>

<style scoped>
.page {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--gray-0);
}

/* ── Mobile search bar ──────────────────────────── */
.mobile-search-bar {
  background: var(--white);
  border-bottom: 1px solid var(--gray-1);
  padding: 14px 16px;
  flex-shrink: 0;
}

.mobile-chat-topbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--white);
  border-bottom: 1px solid var(--gray-1);
  font-size: 14px;
  font-weight: 600;
  color: var(--blue-m);
  flex-shrink: 0;
}

.search-input {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid var(--gray-1);
  border-radius: 10px;
  background: var(--white);
  padding: 0 14px;
  height: 42px;
}

.search-input input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 15px;
  color: var(--ink);
  background: transparent;
  line-height: 1.5;
}

.search-input input::placeholder { color: var(--gray-2); }

.chips-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  direction: ltr;
}

.chips-arrow {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  color: var(--gray-3);
  transition: all 0.15s;
}
.chips-arrow:hover { border-color: var(--blue-m); color: var(--blue-m); }

.filter-chips {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 2px;
  scrollbar-width: none;
  direction: rtl;
}
.filter-chips::-webkit-scrollbar { display: none; }

/* ── Content area ────────────────────────────────── */
.content-area {
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  display: flex;
  overflow: hidden;
}

/* ── Sidebar ─────────────────────────────────────── */
.sidebar { display: none; }

.sidebar-section { display: flex; flex-direction: column; gap: 2px; }

.section-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--gray-3);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  display: block;
}

.sidebar-check {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 7px 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.12s;
}
.sidebar-check:hover { background: var(--gray-0); }

.checkbox {
  width: 17px;
  height: 17px;
  border-radius: 5px;
  border: 1.5px solid var(--gray-2);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.12s;
}
.checkbox.checked { background: var(--blue-m); border-color: var(--blue-m); }

.radio {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 1.5px solid var(--gray-2);
  background: transparent;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.12s;
}
.radio.checked { background: var(--blue-m); border-color: var(--blue-m); }

.sidebar-item-text {
  font-size: 14px;
  color: var(--gray-4);
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 6px;
}
.consult-icon { font-size: 14px; }
.sidebar-divider { height: 1px; background: var(--gray-1); }

/* ── Main ─────────────────────────────────────────── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  width: 100%;
}

.main-header {
  flex-shrink: 0;
  position: relative;
  z-index: 4;
  background: var(--gray-0);
}

/* ── List mode header ─────────────────────────────── */
.main-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.desktop-search-bar { display: none; }

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 6px;
}

.results-count { font-size: 14px; color: var(--gray-2); }
.desktop-count { display: none; }
.desktop-count strong { color: var(--ink); font-weight: 600; }

.sort-filter-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: var(--blue-m);
}

.sort-tabs { display: none; }
.desktop-only { display: none; }

.results-list {
  padding: 8px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ── Chat mode header ─────────────────────────────── */
.chat-mode-header {
  background: var(--white);
}

.chat-search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--gray-1);
}

.chat-search-input {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  background: var(--gray-0);
  border: 1.5px solid var(--gray-1);
  border-radius: 20px;
  padding: 0 14px;
  height: 36px;
}
.chat-search-input input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 13px;
  background: transparent;
  color: var(--ink);
}
.chat-search-input input::placeholder { color: var(--gray-2); }

.chat-count {
  font-size: 12px;
  color: var(--gray-2);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Chat / Messenger panel ───────────────────────── */
.chat-panel {
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  overflow: hidden;
  background: var(--white);
}

/* Left: contacts list — the ONLY scrollable element */
.contacts-pane {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  border-inline-end: 1px solid var(--gray-1);
  flex-shrink: 0;
  -webkit-overflow-scrolling: touch;
}

.contacts-empty {
  padding: 40px 20px;
  text-align: center;
  font-size: 13px;
  color: var(--gray-2);
}

.contact-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.12s;
  border-bottom: 1px solid var(--gray-0);
}
.contact-row:hover { background: var(--gray-0); }
.contact-row.active { background: #eff6ff; }

.contact-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.contact-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
}

.online-dot {
  position: absolute;
  bottom: 1px;
  inset-inline-end: 1px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid var(--white);
}
.online-dot.online  { background: #22c55e; }
.online-dot.offline { background: var(--gray-2); }

.contact-info { flex: 1; min-width: 0; }

.contact-name-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}
.contact-name { font-size: 14px; font-weight: 700; color: var(--ink); }
.contact-time { font-size: 11px; color: var(--gray-2); flex-shrink: 0; }

.contact-sub-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
}
.contact-specialty { font-size: 12px; color: var(--gray-3); }

.unread-badge {
  background: var(--blue-m);
  color: var(--white);
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 99px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.contact-rating-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
}

.contact-status-label {
  font-size: 10px;
  color: var(--gray-2);
  font-weight: 500;
}
.contact-status-label.is-online { color: #16a34a; }

.contact-last-msg {
  font-size: 12px;
  color: var(--gray-2);
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Right: chat window */
.chat-window {
  display: none;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  background: var(--gray-0);
}

/* Empty state */
.cw-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--gray-2);
  padding: 40px;
}
.cw-empty-icon {
  width: 80px;
  height: 80px;
  background: var(--gray-1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cw-empty-title { font-size: 16px; font-weight: 600; color: var(--gray-3); }
.cw-empty-sub   { font-size: 13px; color: var(--gray-2); text-align: center; }

/* Chat header */
.cw-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--white);
  border-bottom: 1px solid var(--gray-1);
  flex-shrink: 0;
}

.cw-back {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: var(--gray-3);
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: background 0.12s;
}
.cw-back:hover { background: var(--gray-0); color: var(--blue-m); }

.cw-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.cw-doctor-info { flex: 1; min-width: 0; }
.cw-doctor-name { font-size: 15px; font-weight: 700; color: var(--ink); display: block; }
.cw-doctor-spec { font-size: 12px; color: var(--gray-3); display: block; }

.cw-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--gray-2);
  flex-shrink: 0;
}
.cw-status.online { color: #16a34a; }
.cw-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gray-2);
}
.cw-status.online .cw-status-dot { background: #22c55e; }

/* Messages area — scrollable */
.cw-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  -webkit-overflow-scrolling: touch;
}

.cw-no-messages {
  text-align: center;
  font-size: 13px;
  color: var(--gray-2);
  margin-top: 40px;
}

/* Message rows */
.msg-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 75%;
}
.msg-me     { align-self: flex-end;  flex-direction: row-reverse; }
.msg-doctor { align-self: flex-start; }

.msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.msg-content { display: flex; flex-direction: column; gap: 3px; }

.msg-bubble {
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
  max-width: 360px;
  word-break: break-word;
}
.bubble-me {
  background: var(--blue-m);
  color: var(--white);
  border-bottom-right-radius: 4px;
}
.bubble-doctor {
  background: var(--white);
  color: var(--ink);
  border: 1px solid var(--gray-1);
  border-bottom-left-radius: 4px;
}

.msg-time {
  font-size: 10px;
  color: var(--gray-2);
  padding: 0 4px;
}
.msg-me .msg-time     { text-align: right; }
.msg-doctor .msg-time { text-align: left; }

/* Input bar */
.cw-input-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: var(--white);
  border-top: 1px solid var(--gray-1);
  flex-shrink: 0;
}

.cw-attach-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--gray-2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;
}
.cw-attach-btn:hover { color: var(--blue-m); background: var(--gray-0); }

.cw-input {
  flex: 1;
  border: 1.5px solid var(--gray-1);
  border-radius: 22px;
  padding: 10px 18px;
  font-size: 14px;
  outline: none;
  background: var(--gray-0);
  color: var(--ink);
  transition: border-color 0.15s;
}
.cw-input:focus { border-color: var(--blue-m); }
.cw-input::placeholder { color: var(--gray-2); }

.cw-send-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: var(--gray-1);
  color: var(--gray-2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
.cw-send-btn.active { background: var(--blue-m); color: var(--white); }
.cw-send-btn:hover.active { background: var(--blue); }

/* ── Desktop layout ───────────────────────────────── */
@media (min-width: 1024px) {
  .mobile-search-bar  { display: none; }
  .mobile-chat-topbar { display: none; }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 260px;
    background: var(--white);
    border-inline-end: 1px solid var(--gray-1);
    padding: 28px 22px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .main-header {
    background: var(--white);
    box-shadow: 0 1px 0 var(--gray-1);
  }

  .desktop-search-bar {
    display: flex;
    gap: 12px;
    padding: 18px 28px;
    border-bottom: 1px solid var(--gray-1);
    background: var(--white);
  }

  .search-input.desktop { flex: 1; height: 44px; }

  .search-btn {
    height: 44px;
    padding: 0 24px;
    border-radius: 10px;
    background: var(--blue-m);
    border: 1.5px solid var(--blue-m);
    color: var(--white);
    font-size: 15px;
    font-weight: 600;
    flex-shrink: 0;
    cursor: pointer;
    transition: background 0.15s;
  }
  .search-btn:hover { background: var(--blue); border-color: var(--blue); }

  .results-header { padding: 18px 28px 10px; }
  .results-count  { font-size: 15px; color: var(--gray-3); }
  .mobile-count   { display: none; }
  .desktop-count  { display: inline; }
  .mobile-only    { display: none !important; }
  .desktop-only   { display: flex !important; }

  .sort-tabs { display: flex; gap: 8px; }
  .sort-tab {
    padding: 7px 16px;
    border-radius: 8px;
    border: 1px solid var(--gray-1);
    background: var(--white);
    font-size: 13px;
    color: var(--gray-4);
    cursor: pointer;
    transition: all 0.12s;
  }
  .sort-tab.active { border-color: var(--blue-m); background: var(--blue-xl); color: var(--blue-m); font-weight: 600; }

  .results-list { padding: 24px 28px 0; max-width: 1120px; margin: 0 auto; width: 100%; }

  /* Chat mode on desktop */
  .chat-mode-header { box-shadow: 0 1px 0 var(--gray-1); }

  .chat-search-bar { padding: 14px 0 14px 0; }

  .contacts-pane { width: 340px; }

  .chat-window { display: flex; }

  .cw-back { display: none; }
}

/* ── Mobile: chat panel behaviour ─────────────────── */
@media (max-width: 1023px) {
  .page { overflow-x: hidden; }

  .contacts-pane { width: 100%; border-inline-end: none; }

  /* When a contact is selected on mobile, slide the contacts off screen
     and show the chat window full width */
  .chat-panel.mobile-chat-active .contacts-pane { display: none; }
  .chat-panel.mobile-chat-active .chat-window   { display: flex; width: 100%; }

  .results-header {
    width: 90%;
    max-width: 100%;
    margin-inline: auto;
    padding-inline: 0;
  }

  .results-list {
    width: 90%;
    max-width: 100%;
    min-width: 0;
    margin-inline: auto;
    padding: 8px 0 24px;
    box-sizing: border-box;
  }

  .pagination {
    width: 90%;
    max-width: 100%;
    min-width: 0;
    margin-inline: auto;
    gap: 8px;
    padding: 24px 0 32px;
    box-sizing: border-box;
  }

  .pg-numbers {
    flex: 1;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding: 4px 2px;
    gap: 6px;
    justify-content: flex-start;
  }
  .pg-numbers::-webkit-scrollbar { display: none; }
  .pg-btn { scroll-snap-align: center; flex-shrink: 0; }
  .pg-ellipsis { flex-shrink: 0; }
}

/* ── Pagination ───────────────────────────────────── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px 16px 32px;
  direction: ltr;
}

.pg-numbers { display: flex; align-items: center; gap: 6px; }

.pg-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 6px;
  border-radius: 10px;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-4);
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1;
}
.pg-btn:hover:not(.active) { border-color: var(--blue-m); color: var(--blue-m); }
.pg-btn.active { background: var(--blue-m); border-color: var(--blue-m); color: var(--white); font-weight: 700; }

.pg-arrow {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  color: var(--gray-3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}
.pg-arrow:hover:not(:disabled) { border-color: var(--blue-m); color: var(--blue-m); }
.pg-arrow:disabled { opacity: 0.35; cursor: not-allowed; }

.pg-ellipsis { font-size: 15px; color: var(--gray-3); padding: 0 4px; user-select: none; }

@media (min-width: 1024px) {
  .pagination { padding: 28px 28px 40px; gap: 8px; }
  .pg-btn   { min-width: 44px; height: 44px; font-size: 15px; }
  .pg-arrow { width: 44px; height: 44px; }
}

/* ── Template picker ──────────────────────────────── */
.tpl-wrap {
  position: relative;
  flex-shrink: 0;
}

.cw-tpl-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: none;
  color: var(--gray-2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.cw-tpl-btn:hover,
.cw-tpl-btn.active { color: var(--blue-m); background: var(--gray-0); }

/* invisible full-screen close layer */
.tpl-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
}

.tpl-dropdown {
  position: absolute;
  bottom: calc(100% + 10px);
  inset-inline-start: 0;
  min-width: 230px;
  background: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.14);
  padding: 8px 6px;
  z-index: 41;
}

.tpl-dropdown-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--gray-2);
  padding: 4px 10px 6px;
}

.tpl-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  text-align: start;
  transition: background 0.12s;
}
.tpl-item:hover { background: var(--gray-0); }

.tpl-item-icon { font-size: 18px; flex-shrink: 0; }

.tpl-item-body { display: flex; flex-direction: column; gap: 1px; }
.tpl-item-name { font-size: 13px; font-weight: 600; color: var(--ink); }
.tpl-item-sub  { font-size: 11px; color: var(--gray-2); }

/* ── Attachment-request bubble ────────────────────── */
.bubble-ar {
  background: var(--blue-m) !important;
  border-radius: 18px 18px 4px 18px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 300px;
}

.ar-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ar-icon { font-size: 15px; }

.ar-label {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  flex: 1;
}

.ar-fulfilled {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  color: #86efac;
  background: rgba(255, 255, 255, 0.15);
  padding: 2px 6px;
  border-radius: 99px;
  flex-shrink: 0;
}

.ar-text {
  font-size: 13px;
  color: var(--white);
  line-height: 1.45;
  margin: 0;
}

.ar-link {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #bfdbfe;
  text-decoration: none;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 8px;
  transition: color 0.12s;
}
.ar-link:hover { color: var(--white); }

/* ── Attachment-received bubble ───────────────────── */
.bubble-recv {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  max-width: 260px;
}

.recv-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.recv-icon { font-size: 16px; }

.recv-new {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
}

.recv-filename {
  font-size: 12px;
  color: var(--gray-4);
  font-weight: 500;
  word-break: break-all;
}

.recv-type {
  font-size: 11px;
  color: var(--gray-2);
}

.recv-view {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--blue-m);
  text-decoration: none;
  border-top: 1px solid var(--gray-1);
  padding-top: 8px;
  transition: color 0.12s;
}
.recv-view:hover { color: var(--blue); }

/* ── Attachment Request Modal ─────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}

.modal-card {
  background: var(--white);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
  width: 100%;
  max-width: 420px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--gray-0);
  color: var(--gray-3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}
.modal-close:hover { background: var(--gray-1); color: var(--ink); }

.modal-sub {
  font-size: 13px;
  color: var(--gray-3);
  margin: 0;
  line-height: 1.5;
}

.modal-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 2px solid var(--gray-1);
  border-radius: 12px;
  background: var(--white);
  cursor: pointer;
  text-align: start;
  transition: border-color 0.15s, background 0.15s;
  width: 100%;
}
.modal-option:hover   { border-color: var(--blue-m); background: #eff6ff; }
.modal-option.selected {
  border-color: var(--blue-m);
  background: #eff6ff;
}

.opt-icon  { font-size: 22px; flex-shrink: 0; }
.opt-label { font-size: 14px; font-weight: 600; color: var(--ink); flex: 1; }
.opt-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--blue-m);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 4px;
}

.modal-cancel {
  height: 38px;
  padding: 0 18px;
  border-radius: 8px;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-4);
  cursor: pointer;
  transition: background 0.12s;
}
.modal-cancel:hover { background: var(--gray-0); }

.modal-send {
  height: 38px;
  padding: 0 20px;
  border-radius: 8px;
  border: none;
  background: var(--blue-m);
  color: var(--white);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}
.modal-send:disabled { opacity: 0.4; cursor: not-allowed; }
.modal-send:not(:disabled):hover { background: var(--blue); }
</style>
