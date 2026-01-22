"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, Lock, Repeat, Users, Wallet, Globe, Zap,
  ChevronDown, X, Loader2, ExternalLink, Copy, RefreshCw,
  ArrowDownToLine, ArrowUpFromLine, AlertCircle, Check, Info, Clock, Timer
} from "lucide-react"

// ============================================
// TYPES
// ============================================
type Page = "vault" | "yield" | "stream" | "guardian"
type Language = "EN" | "PT" | "ES" | "FR"
type ToastType = "success" | "error" | "info" | "warning"
type ModalType = "deposit" | "withdraw" | "lock" | "stream" | "guardian" | null

interface Toast {
  id: number
  type: ToastType
  message: string
}

// ============================================
// TRANSLATIONS
// ============================================
const translations = {
  EN: {
    connect: "Connect Wallet",
    vault: "The Vault",
    yield: "Yield Lock",
    stream: "The Stream",
    guardian: "The Guardian",
    deposit: "Deposit",
    withdraw: "Withdraw",
    confirm: "Confirm",
    cancel: "Cancel",
    yourBalance: "Your Balance",
    deposited: "Deposited",
    apy: "APY",
    yieldEarned: "Yield Earned",
    tvl: "Total Value Locked",
    activeStreams: "Active Streams",
    totalStreaming: "Total Streaming",
    released: "Released",
    nextRelease: "Next Release",
    recoveryAddress: "Recovery Address",
    inactivityTimer: "Inactivity Timer",
    gasEstimate: "Gas Estimate",
    installWallet: "Install MetaMask or OneKey",
    connected: "Wallet Connected!",
    disconnected: "Wallet Disconnected",
    txComplete: "Transaction Complete!",
    notConfigured: "Guardian Not Configured",
    noProtection: "Your assets have no recovery protection",
    lockAssets: "Lock Assets",
    createStream: "Create Stream",
    activateGuardian: "Activate Guardian",
    amount: "Amount",
    duration: "Duration",
    frequency: "Frequency",
    recipient: "Recipient (optional)",
    weekly: "Weekly",
    monthly: "Monthly",
    days: "Days",
    month: "Month",
    months: "Months",
    year: "Year",
    // Portfolio translations
    yourPortfolio: "Your Portfolio",
    walletBalance: "Wallet Balance",
    vaultStatus: "Vault Status",
    activeDeposit: "Active Deposit",
    yieldLockStatus: "Yield Lock Status",
    lockedBalance: "Locked Balance",
    accumulatedProfit: "Accumulated Profit",
    unlockDate: "Unlock Date",
    guardianStatus: "Guardian Status",
    heritageAddress: "Heritage Address",
    protectionActive: "Protection Active",
    streamStatusLabel: "Stream Status",
    active: "Active",
    inactive: "Inactive",
    progress: "Progress",
    remaining: "Remaining",
    noActiveStreams: "No active streams",
    syncData: "Sync Data",
    syncing: "Syncing...",
    dataSynced: "Data synchronized!",
    disconnect: "Disconnect",
    connectedWallet: "Connected Wallet",
    addressCopied: "Address copied!",
    view: "View",
    manageLocks: "Manage Locks",
    configureGuardian: "Configure Guardian",
    noActiveLock: "No Active Lock",
    noDeposit: "No Deposit",
    notConnected: "---"
  },
  PT: {
    connect: "Conectar Carteira",
    vault: "O Cofre",
    yield: "Yield Lock",
    stream: "O Fluxo",
    guardian: "O Guardiao",
    deposit: "Depositar",
    withdraw: "Sacar",
    confirm: "Confirmar",
    cancel: "Cancelar",
    yourBalance: "Seu Saldo",
    deposited: "Depositado",
    apy: "APY",
    yieldEarned: "Rendimento",
    tvl: "Valor Total Bloqueado",
    activeStreams: "Fluxos Ativos",
    totalStreaming: "Total em Fluxo",
    released: "Liberado",
    nextRelease: "Proxima Liberacao",
    recoveryAddress: "Endereco de Recuperacao",
    inactivityTimer: "Timer de Inatividade",
    gasEstimate: "Estimativa de Gas",
    installWallet: "Instale MetaMask ou OneKey",
    connected: "Carteira Conectada!",
    disconnected: "Carteira Desconectada",
    txComplete: "Transacao Completa!",
    notConfigured: "Guardiao Nao Configurado",
    noProtection: "Seus ativos nao tem protecao de recuperacao",
    lockAssets: "Bloquear Ativos",
    createStream: "Criar Fluxo",
    activateGuardian: "Ativar Guardiao",
    amount: "Quantia",
    duration: "Duracao",
    frequency: "Frequencia",
    recipient: "Destinatario (opcional)",
    weekly: "Semanal",
    monthly: "Mensal",
    days: "Dias",
    month: "Mes",
    months: "Meses",
    year: "Ano",
    // Portfolio translations
    yourPortfolio: "Seu Portfolio",
    walletBalance: "Saldo na Carteira",
    vaultStatus: "Status do Cofre",
    activeDeposit: "Deposito Ativo",
    yieldLockStatus: "Status do Yield Lock",
    lockedBalance: "Saldo Bloqueado",
    accumulatedProfit: "Lucro Acumulado",
    unlockDate: "Data de Desbloqueio",
    guardianStatus: "Status do Guardiao",
    heritageAddress: "Endereco de Heranca",
    protectionActive: "Protecao Ativa",
    streamStatusLabel: "Status do Fluxo",
    active: "Ativo",
    inactive: "Inativo",
    progress: "Progresso",
    remaining: "Restante",
    noActiveStreams: "Nenhum fluxo ativo",
    syncData: "Sincronizar Dados",
    syncing: "Sincronizando...",
    dataSynced: "Dados sincronizados!",
    disconnect: "Desconectar",
    connectedWallet: "Carteira Conectada",
    addressCopied: "Endereco copiado!",
    view: "Ver",
    manageLocks: "Gerenciar Bloqueios",
    configureGuardian: "Configurar Guardiao",
    noActiveLock: "Nenhum Bloqueio Ativo",
    noDeposit: "Nenhum Deposito",
    notConnected: "---"
  },
  ES: {
    connect: "Conectar Billetera",
    vault: "La Boveda",
    yield: "Yield Lock",
    stream: "El Flujo",
    guardian: "El Guardian",
    deposit: "Depositar",
    withdraw: "Retirar",
    confirm: "Confirmar",
    cancel: "Cancelar",
    yourBalance: "Tu Saldo",
    deposited: "Depositado",
    apy: "APY",
    yieldEarned: "Rendimiento",
    tvl: "Valor Total Bloqueado",
    activeStreams: "Flujos Activos",
    totalStreaming: "Total en Flujo",
    released: "Liberado",
    nextRelease: "Proxima Liberacion",
    recoveryAddress: "Direccion de Recuperacion",
    inactivityTimer: "Timer de Inactividad",
    gasEstimate: "Estimacion de Gas",
    installWallet: "Instala MetaMask o OneKey",
    connected: "Billetera Conectada!",
    disconnected: "Billetera Desconectada",
    txComplete: "Transaccion Completa!",
    notConfigured: "Guardian No Configurado",
    noProtection: "Tus activos no tienen proteccion de recuperacion",
    lockAssets: "Bloquear Activos",
    createStream: "Crear Flujo",
    activateGuardian: "Activar Guardian",
    amount: "Cantidad",
    duration: "Duracion",
    frequency: "Frecuencia",
    recipient: "Destinatario (opcional)",
    weekly: "Semanal",
    monthly: "Mensual",
    days: "Dias",
    month: "Mes",
    months: "Meses",
    year: "Ano",
    // Portfolio translations
    yourPortfolio: "Tu Portafolio",
    walletBalance: "Saldo en Billetera",
    vaultStatus: "Estado de la Boveda",
    activeDeposit: "Deposito Activo",
    yieldLockStatus: "Estado del Yield Lock",
    lockedBalance: "Saldo Bloqueado",
    accumulatedProfit: "Ganancia Acumulada",
    unlockDate: "Fecha de Desbloqueo",
    guardianStatus: "Estado del Guardian",
    heritageAddress: "Direccion de Herencia",
    protectionActive: "Proteccion Activa",
    streamStatusLabel: "Estado del Flujo",
    active: "Activo",
    inactive: "Inactivo",
    progress: "Progreso",
    remaining: "Restante",
    noActiveStreams: "Sin flujos activos",
    syncData: "Sincronizar Datos",
    syncing: "Sincronizando...",
    dataSynced: "Datos sincronizados!",
    disconnect: "Desconectar",
    connectedWallet: "Billetera Conectada",
    addressCopied: "Direccion copiada!",
    view: "Ver",
    manageLocks: "Gestionar Bloqueos",
    configureGuardian: "Configurar Guardian",
    noActiveLock: "Sin Bloqueo Activo",
    noDeposit: "Sin Deposito",
    notConnected: "---"
  },
  FR: {
    connect: "Connecter Portefeuille",
    vault: "Le Coffre",
    yield: "Yield Lock",
    stream: "Le Flux",
    guardian: "Le Gardien",
    deposit: "Deposer",
    withdraw: "Retirer",
    confirm: "Confirmer",
    cancel: "Annuler",
    yourBalance: "Votre Solde",
    deposited: "Depose",
    apy: "APY",
    yieldEarned: "Rendement",
    tvl: "Valeur Totale Verrouillee",
    activeStreams: "Flux Actifs",
    totalStreaming: "Total en Flux",
    released: "Libere",
    nextRelease: "Prochaine Liberation",
    recoveryAddress: "Adresse de Recuperation",
    inactivityTimer: "Timer d'Inactivite",
    gasEstimate: "Estimation du Gas",
    installWallet: "Installez MetaMask ou OneKey",
    connected: "Portefeuille Connecte!",
    disconnected: "Portefeuille Deconnecte",
    txComplete: "Transaction Complete!",
    notConfigured: "Gardien Non Configure",
    noProtection: "Vos actifs n'ont aucune protection de recuperation",
    lockAssets: "Verrouiller les Actifs",
    createStream: "Creer un Flux",
    activateGuardian: "Activer le Gardien",
    amount: "Montant",
    duration: "Duree",
    frequency: "Frequence",
    recipient: "Destinataire (optionnel)",
    weekly: "Hebdomadaire",
    monthly: "Mensuel",
    days: "Jours",
    month: "Mois",
    months: "Mois",
    year: "An",
    // Portfolio translations
    yourPortfolio: "Votre Portefeuille",
    walletBalance: "Solde du Portefeuille",
    vaultStatus: "Etat du Coffre",
    activeDeposit: "Depot Actif",
    yieldLockStatus: "Etat du Yield Lock",
    lockedBalance: "Solde Verrouille",
    accumulatedProfit: "Profit Accumule",
    unlockDate: "Date de Deverrouillage",
    guardianStatus: "Etat du Gardien",
    heritageAddress: "Adresse d'Heritage",
    protectionActive: "Protection Active",
    streamStatusLabel: "Etat du Flux",
    active: "Actif",
    inactive: "Inactif",
    progress: "Progression",
    remaining: "Restant",
    noActiveStreams: "Aucun flux actif",
    syncData: "Synchroniser",
    syncing: "Synchronisation...",
    dataSynced: "Donnees synchronisees!",
    disconnect: "Deconnecter",
    connectedWallet: "Portefeuille Connecte",
    addressCopied: "Adresse copiee!",
    view: "Voir",
    manageLocks: "Gerer les Verrous",
    configureGuardian: "Configurer le Gardien",
    noActiveLock: "Aucun Verrou Actif",
    noDeposit: "Aucun Depot",
    notConnected: "---"
  }
}

// ============================================
// PAGE COLORS
// ============================================
const pageColors: Record<Page, string> = {
  vault: "#00D1FF",
  yield: "#A855F7",
  stream: "#10B981",
  guardian: "#F59E0B"
}

// ============================================
// CONTRACT CONFIG (DO NOT CHANGE)
// ============================================
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" // Replace with your deployed contract
const CONTRACT_ABI = [
  // Placeholder ABI - replace with your actual contract ABI
  "function balances(address) view returns (uint256)",
  "function guardians(address) view returns (address)",
  "function lockedBalances(address) view returns (uint256)",
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function setGuardian(address guardian, uint256 inactivityPeriod) external"
]

// ============================================
// MAIN COMPONENT
// ============================================
export default function ArcSovereign() {
  // ===== PAGE STATE =====
  const [activePage, setActivePage] = useState<Page>("vault")
  const [language, setLanguage] = useState<Language>("EN")
  const [selectedAsset, setSelectedAsset] = useState<"USDC" | "EURC">("USDC")
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  
  // ===== WALLET STATE =====
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  
  // ===== DATA STATE (Clean Slate - all start at 0) =====
  const [walletBalances, setWalletBalances] = useState({ ARC: "0.00", USDC: "0.00", EURC: "0.00" })
  const [yieldDisplay, setYieldDisplay] = useState("0.00000000")
  
  // ===== FORM STATE =====
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [lockAmount, setLockAmount] = useState("")
  const [lockDuration, setLockDuration] = useState<"1m" | "6m" | "1y">("6m")
  const [streamAmount, setStreamAmount] = useState("")
  const [streamFrequency, setStreamFrequency] = useState<"weekly" | "monthly">("weekly")
  const [guardianTimer, setGuardianTimer] = useState("90")
  const [guardianAddress, setGuardianAddress] = useState("") // Added declaration
  
  // ===== REAL-TIME YIELD STATE =====
  const [realTimeYieldEarned, setRealTimeYieldEarned] = useState("0.00000000")
  const yieldEarnedRef = useRef(0)
  
  // ===== UI STATE =====
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // ===== PORTFOLIO DATA STATE (For ethers.js integration) =====
  const [arcBalance, setArcBalance] = useState("0.0000")
  const [vaultBalance, setVaultBalance] = useState("0.00")
  const [yieldLockTotal, setYieldLockTotal] = useState("0.00")
  const [yieldLockProfit, setYieldLockProfit] = useState("0.00")
  const [yieldLockEndTime, setYieldLockEndTime] = useState(Date.now() + 86400000 * 45) // 45 days from now
  const [guardianConfigured, setGuardianConfigured] = useState("")
  const [streamStatus, setStreamStatus] = useState<"active" | "inactive">("inactive")
  const [streamProgress, setStreamProgress] = useState(0)
  const [streamReleased, setStreamReleased] = useState("0.00")
  
  // ===== REFS (prevent loops) =====
  const yieldRef = useRef(0)
  const mountedRef = useRef(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Get current translations
  const t = translations[language]
  
  // ===== TOAST FUNCTION (stable) =====
  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), 4000)
  }, [])
  
  // ===== REFRESH DATA FROM BLOCKCHAIN =====
  const refreshData = useCallback(async (userAddress: string) => {
    const ethereum = (window as Window & { ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    }}).ethereum
    
    if (!ethereum || !userAddress) return
    
    try {
      // 1. Get native ARC balance
      const balanceHex = await ethereum.request({
        method: "eth_getBalance",
        params: [userAddress, "latest"]
      }) as string
      
      // Convert from wei to ARC (18 decimals)
      const balanceWei = BigInt(balanceHex)
      const balanceArc = Number(balanceWei) / 1e18
      setArcBalance(balanceArc.toFixed(4))
      
      // 2. Get contract data (placeholder - requires ethers.js for full integration)
      // When you have ethers.js set up, uncomment and use:
      /*
      const provider = new ethers.providers.Web3Provider(ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      
      // Vault balance
      const vBalance = await contract.balances(userAddress)
      setVaultBalance(ethers.utils.formatUnits(vBalance, 6)) // USDC has 6 decimals
      
      // Locked balance
      const lBalance = await contract.lockedBalances(userAddress)
      setYieldLockTotal(ethers.utils.formatUnits(lBalance, 6))
      
      // Guardian address
      const gAddress = await contract.guardians(userAddress)
      if (gAddress !== "0x0000000000000000000000000000000000000000") {
        setGuardianConfigured(gAddress.substring(0, 6) + "..." + gAddress.substring(38))
      }
      */
      
      // Contract data will be fetched via ethers.js when integrated
      // States remain at 0 until actual contract calls are made
      
    } catch (err) {
      console.log("[v0] Error fetching blockchain data:", err)
    }
  }, [])
  
  // ===== CONNECT WALLET (stable) =====
  const connectWallet = useCallback(async () => {
    if (isConnecting) return
    
    const ethereum = (window as Window & { ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<string[] | string>
      on: (event: string, handler: (data: unknown) => void) => void
      removeListener: (event: string, handler: (data: unknown) => void) => void
    }}).ethereum
    
    if (!ethereum) {
      addToast("error", t.installWallet)
      return
    }
    
    setIsConnecting(true)
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" }) as string[]
      if (accounts[0]) {
        setWalletAddress(accounts[0])
        setIsConnected(true)
        localStorage.setItem("arc_wallet_address", accounts[0])
        addToast("success", t.connected)
        
        // Fetch blockchain data
        refreshData(accounts[0])
        
        // Add Arc Network (fire and forget)
        ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x1F9",
            chainName: "Arc Testnet",
            nativeCurrency: { name: "ARC", symbol: "ARC", decimals: 18 },
            rpcUrls: ["https://rpc.testnet.arc.network"],
            blockExplorerUrls: ["https://explorer.testnet.arc.network"]
          }]
        }).catch(() => {})
      }
    } catch {
      addToast("error", "Connection failed")
    }
    setIsConnecting(false)
  }, [isConnecting, addToast, t, refreshData])
  
  const disconnectWallet = useCallback(() => {
    setIsConnected(false)
    setWalletAddress("")
    localStorage.removeItem("arc_wallet_address")
    
    // Reset all balances to 0 (Clean Slate)
    setArcBalance("0.0000")
    setWalletBalances({ ARC: "0.00", USDC: "0.00", EURC: "0.00" })
    setVaultBalance("0.00")
    setYieldLockTotal("0.00")
    setYieldLockProfit("0.00")
    setGuardianConfigured("")
    setStreamStatus("inactive")
    setStreamProgress(0)
    setStreamReleased("0.00")
    yieldRef.current = 0
    yieldEarnedRef.current = 0
    setYieldDisplay("0.00000000")
    setRealTimeYieldEarned("0.00000000")
    
    addToast("info", t.disconnected)
  }, [addToast, t])
  
  // ===== HANDLE REFRESH (for Portfolio sync button) =====
  const handleRefresh = useCallback(async () => {
    if (!walletAddress || isRefreshing) return
    
    setIsRefreshing(true)
    await refreshData(walletAddress)
    
    // Simulate network delay for visual feedback
    await new Promise(r => setTimeout(r, 800))
    
    setIsRefreshing(false)
    addToast("success", t.dataSynced)
  }, [walletAddress, isRefreshing, refreshData, addToast, t])
  
  // ===== DERIVED STATE =====
  const isStreamActive = streamStatus === "active"
  
  // APY rates as decimals: 1m = 5%, 6m = 12%, 1y = 20%
  const apyRates: Record<"1m" | "6m" | "1y", number> = {
    "1m": 0.05,
    "6m": 0.12,
    "1y": 0.20
  }
  
  // ===== REAL-TIME YIELD CALCULATION =====
  useEffect(() => {
    // Parse locked amount (remove commas and convert to number)
    const lockedAmount = Number.parseFloat(yieldLockTotal.replace(/,/g, "")) || 0
    
    // If no locked amount, reset and don't start interval
    if (lockedAmount <= 0) {
      yieldEarnedRef.current = 0
      setRealTimeYieldEarned("0.00000000")
      return
    }
    
    // Get current APY based on selected duration
    const currentApy = apyRates[lockDuration]
    
    // Calculate yield per second: (lockedAmount * APY) / 31,536,000 seconds per year
    const secondsPerYear = 31536000
    const yieldPerSecond = (lockedAmount * currentApy) / secondsPerYear
    
    // Start interval that updates every second
    const yieldInterval = setInterval(() => {
      yieldEarnedRef.current += yieldPerSecond
      setRealTimeYieldEarned(yieldEarnedRef.current.toFixed(8))
    }, 1000)
    
    return () => clearInterval(yieldInterval)
  }, [yieldLockTotal, lockDuration])
  
  // ===== SINGLE useEffect - RUNS ONCE =====
  useEffect(() => {
    // Prevent double-run in strict mode
    if (mountedRef.current) return
    mountedRef.current = true
    
    // 1. Yield ticker will be started by separate useEffect based on balance
    
    // Helper to fetch blockchain data inline
    const fetchBlockchainData = async (userAddress: string, eth: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    }) => {
      try {
        const balanceHex = await eth.request({
          method: "eth_getBalance",
          params: [userAddress, "latest"]
        }) as string
        const balanceWei = BigInt(balanceHex)
        const balanceArc = Number(balanceWei) / 1e18
        setArcBalance(balanceArc.toFixed(4))
        
        // Contract data fetched via ethers.js - states stay at 0 until integrated
      } catch (err) {
        console.log("[v0] Error fetching data:", err)
      }
    }
    
    // 2. Check existing wallet connection
    const ethereum = (window as Window & { ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<string[] | string>
      on: (event: string, handler: (data: unknown) => void) => void
      removeListener: (event: string, handler: (data: unknown) => void) => void
    }}).ethereum
    
    if (ethereum) {
      // Check saved connection
      const savedAddress = localStorage.getItem("arc_wallet_address")
      
      ethereum.request({ method: "eth_accounts" })
        .then(accounts => {
          const accs = accounts as string[]
          if (accs[0]) {
            // If saved address matches, restore connection
            if (!savedAddress || accs[0].toLowerCase() === savedAddress.toLowerCase()) {
              setWalletAddress(accs[0])
              setIsConnected(true)
              localStorage.setItem("arc_wallet_address", accs[0])
              // Fetch blockchain data on restore
              fetchBlockchainData(accs[0], ethereum)
            }
          }
        })
        .catch(() => {})
      
      // 3. Listen for account changes
      const handleAccounts = (data: unknown) => {
        const accounts = data as string[]
        if (accounts[0]) {
          setWalletAddress(accounts[0])
          setIsConnected(true)
          localStorage.setItem("arc_wallet_address", accounts[0])
          // Refresh data on account change
          fetchBlockchainData(accounts[0], ethereum)
        } else {
          setWalletAddress("")
          setIsConnected(false)
          localStorage.removeItem("arc_wallet_address")
          // Reset balances
          setArcBalance("0.0000")
          setVaultBalance("0.00")
          setYieldLockTotal("0.00")
          setGuardianConfigured("")
        }
      }
      
      ethereum.on("accountsChanged", handleAccounts)
    }
    
    // Cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, []) // EMPTY ARRAY = runs ONCE only
  
  // ===== VAULT YIELD TICKER (only runs when balance > 0) =====
  useEffect(() => {
    const vaultNum = Number.parseFloat(vaultBalance.replace(/,/g, "")) || 0
    const lockedNum = Number.parseFloat(yieldLockTotal.replace(/,/g, "")) || 0
    
    // If both are 0, keep ticker at 0
    if (vaultNum <= 0 && lockedNum <= 0) {
      yieldRef.current = 0
      setYieldDisplay("0.00000000")
      return
    }
    
    // Start yield ticker based on combined balance
    const totalBalance = vaultNum + lockedNum
    const baseYieldPerTick = (totalBalance * 0.12) / 31536000 / 10 // APY 12% per 100ms
    
    intervalRef.current = setInterval(() => {
      yieldRef.current += baseYieldPerTick + Math.random() * baseYieldPerTick * 0.1
      setYieldDisplay(yieldRef.current.toFixed(8))
    }, 100)
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [vaultBalance, yieldLockTotal])
  
  // ===== HANDLE TRANSACTION SUCCESS (updates states based on transaction type) =====
  const handleTransactionSuccess = useCallback((
    type: "deposit" | "withdraw" | "lock" | "stream" | "guardian",
    amount?: string,
    extra?: { guardianAddr?: string; streamFreq?: string }
  ) => {
    const numAmount = Number.parseFloat(amount?.replace(/,/g, "") || "0")
    
    switch (type) {
      case "deposit":
        setVaultBalance(prev => {
          const current = Number.parseFloat(prev.replace(/,/g, "")) || 0
          return (current + numAmount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        })
        // Update wallet balance (subtract from USDC/EURC)
        setWalletBalances(prev => ({
          ...prev,
          [selectedAsset]: (Number.parseFloat(prev[selectedAsset]) - numAmount).toFixed(2)
        }))
        break
        
      case "withdraw":
        setVaultBalance(prev => {
          const current = Number.parseFloat(prev.replace(/,/g, "")) || 0
          const newVal = Math.max(0, current - numAmount)
          return newVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        })
        // Update wallet balance (add to USDC/EURC)
        setWalletBalances(prev => ({
          ...prev,
          [selectedAsset]: (Number.parseFloat(prev[selectedAsset]) + numAmount).toFixed(2)
        }))
        break
        
      case "lock":
        setYieldLockTotal(prev => {
          const current = Number.parseFloat(prev.replace(/,/g, "")) || 0
          return (current + numAmount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        })
        // Subtract from vault balance when locking
        setVaultBalance(prev => {
          const current = Number.parseFloat(prev.replace(/,/g, "")) || 0
          const newVal = Math.max(0, current - numAmount)
          return newVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        })
        // Set unlock time based on duration
        const durationDays = lockDuration === "1m" ? 30 : lockDuration === "6m" ? 180 : 365
        setYieldLockEndTime(Date.now() + durationDays * 86400000)
        // Reset yield earned for new lock
        yieldEarnedRef.current = 0
        setRealTimeYieldEarned("0.00000000")
        break
        
      case "stream":
        setStreamStatus("active")
        setStreamProgress(0)
        setStreamReleased("0.00")
        break
        
      case "guardian":
        if (extra?.guardianAddr) {
          setGuardianConfigured(extra.guardianAddr)
          setGuardianAddress(extra.guardianAddr)
        }
        break
    }
  }, [selectedAsset, lockDuration])
  
  // ===== PROCESS TRANSACTION =====
  const processTransaction = useCallback(async () => {
    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsProcessing(false)
    
    // Update states based on active modal
    if (activeModal === "deposit" && depositAmount) {
      handleTransactionSuccess("deposit", depositAmount)
    } else if (activeModal === "withdraw" && withdrawAmount) {
      handleTransactionSuccess("withdraw", withdrawAmount)
    } else if (activeModal === "lock" && lockAmount) {
      handleTransactionSuccess("lock", lockAmount)
    } else if (activeModal === "stream" && streamAmount) {
      handleTransactionSuccess("stream", streamAmount)
    } else if (activeModal === "guardian" && guardianAddress) {
      handleTransactionSuccess("guardian", undefined, { guardianAddr: guardianAddress })
    }
    
    setActiveModal(null)
    addToast("success", t.txComplete)
    
    // Reset form fields
    setDepositAmount("")
    setWithdrawAmount("")
    setLockAmount("")
    setStreamAmount("")
    setGuardianAddress("")
  }, [addToast, t, activeModal, depositAmount, withdrawAmount, lockAmount, streamAmount, guardianAddress, handleTransactionSuccess])

  // ===== LOCK APY MAPPING =====
  const lockApyMap = {
    "1m": { apy: "5%", mult: "1x", label: `1 ${t.month}` },
    "6m": { apy: "12%", mult: "2.4x", label: `6 ${t.months}` },
    "1y": { apy: "20%", mult: "4x", label: `1 ${t.year}` }
  }

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      
      {/* === HEADER === */}
      <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: pageColors[activePage] }}
            >
              <Zap className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight">Arc Sovereign</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider">Wealth Protocol</div>
            </div>
          </div>
          
          {/* Nav Tabs - Desktop */}
          <nav className="hidden lg:flex gap-1 p-1 rounded-xl bg-white/5">
            {([
              { id: "vault" as Page, label: t.vault, icon: Shield },
              { id: "yield" as Page, label: t.yield, icon: Lock },
              { id: "stream" as Page, label: t.stream, icon: Repeat },
              { id: "guardian" as Page, label: t.guardian, icon: Users }
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePage(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activePage === tab.id ? pageColors[tab.id] : "transparent",
                  color: activePage === tab.id ? "#000" : "rgba(255,255,255,0.5)"
                }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
          
          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-sm hover:bg-white/10 transition-colors"
              >
                <Globe className="w-4 h-4" style={{ color: pageColors[activePage] }} />
                {language}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showLangDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowLangDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 py-1 w-28 bg-[#111] border border-white/10 rounded-lg z-50">
                    {(["EN", "PT", "ES", "FR"] as Language[]).map(l => (
                      <button
                        key={l}
                        onClick={() => { setLanguage(l); setShowLangDropdown(false) }}
                        className="block w-full px-3 py-1.5 text-left text-sm hover:bg-white/5 transition-colors"
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Asset Toggle */}
            <div className="hidden sm:flex p-1 rounded-lg bg-white/5">
              {(["USDC", "EURC"] as const).map(a => (
                <button
                  key={a}
                  onClick={() => setSelectedAsset(a)}
                  className="px-3 py-1 rounded text-sm font-medium transition-all"
                  style={{
                    background: selectedAsset === a ? pageColors[activePage] : "transparent",
                    color: selectedAsset === a ? "#000" : "rgba(255,255,255,0.5)"
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
            
            {/* Twitter/X Link */}
            <a
              href="https://x.com/ArcProtocol"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            
            {/* Connect / Address Button */}
            {isConnected ? (
              <button
                onClick={() => setIsPortfolioOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30"
              >
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-mono">{walletAddress.slice(0,6)}...{walletAddress.slice(-4)}</span>
              </button>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: pageColors[activePage],
                  color: "#000"
                }}
              >
                {isConnecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wallet className="w-4 h-4" />
                )}
                {t.connect}
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* === MOBILE NAV === */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-white/10 flex justify-around py-2">
        {([
          { id: "vault" as Page, icon: Shield },
          { id: "yield" as Page, icon: Lock },
          { id: "stream" as Page, icon: Repeat },
          { id: "guardian" as Page, icon: Users }
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            className="flex flex-col items-center gap-1 px-4 py-1 transition-colors"
            style={{ color: activePage === tab.id ? pageColors[tab.id] : "rgba(255,255,255,0.4)" }}
          >
            <tab.icon className="w-6 h-6" />
            <span className="text-[10px] capitalize">{tab.id}</span>
          </button>
        ))}
      </nav>
      
      {/* === DASHBOARD (when connected) === */}
      {isConnected && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div 
            className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border"
            style={{
              background: `${pageColors[activePage]}08`,
              borderColor: `${pageColors[activePage]}15`
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full"
                style={{ background: `linear-gradient(135deg, ${pageColors[activePage]}, #A855F7)` }}
              />
              <div>
                <div className="font-mono text-sm">{walletAddress}</div>
                <div className="flex items-center gap-1 text-xs text-white/40">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Arc Testnet
                </div>
              </div>
            </div>
<div className="flex gap-6 text-sm">
              <div><span className="text-white/40">ARC:</span> <span className="font-semibold">{arcBalance}</span></div>
              <div><span className="text-white/40">USDC:</span> <span className="font-semibold">{walletBalances.USDC}</span></div>
              <div><span className="text-white/40">EURC:</span> <span className="font-semibold">{walletBalances.EURC}</span></div>
            </div>
          </div>
        </div>
      )}
      
      {/* === MAIN CONTENT - ALL PAGES ALWAYS RENDERED === */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 lg:pb-8">
        
        {/* ==================== VAULT PAGE ==================== */}
        <div style={{ display: activePage === "vault" ? "block" : "none" }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t.vault}</h1>
            <p className="text-white/50">Secure deposits with yield generation</p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-white/40 text-sm mb-1">{t.yourBalance}</div>
              <div className="text-2xl font-bold">{isConnected ? walletBalances[selectedAsset] : t.notConnected} <span className="text-base text-white/50">{isConnected ? selectedAsset : ""}</span></div>
            </div>
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-white/40 text-sm mb-1">{t.deposited}</div>
              <div className="text-2xl font-bold">{isConnected ? vaultBalance : t.notConnected} <span className="text-base text-white/50">{isConnected ? selectedAsset : ""}</span></div>
            </div>
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-white/40 text-sm mb-1">{t.apy}</div>
              <div className="text-2xl font-bold text-[#10B981]">5.00%</div>
            </div>
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-white/40 text-sm mb-1">{t.yieldEarned}</div>
              <div className="text-2xl font-bold font-mono" style={{ color: pageColors.vault }}>{yieldDisplay}</div>
            </div>
          </div>
          
          {/* Deposit/Withdraw Cards */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Deposit Card */}
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ArrowDownToLine className="w-5 h-5" style={{ color: pageColors.vault }} />
                {t.deposit}
              </h3>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-4 mb-3 rounded-lg bg-black/50 border border-white/10 text-xl outline-none focus:border-[#00D1FF]/50 transition-colors"
              />
              <div className="flex gap-2 mb-4">
                {["25", "50", "75", "100"].map(pct => (
                  <button
                    key={pct}
                    onClick={() => setDepositAmount((Number(walletBalances[selectedAsset]) * Number(pct) / 100).toFixed(2))}
                    className="flex-1 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <button
                onClick={() => isConnected && setActiveModal("deposit")}
                disabled={!isConnected || !depositAmount}
                className="w-full py-4 rounded-xl font-semibold transition-all"
                style={{
                  background: isConnected && depositAmount ? pageColors.vault : "rgba(255,255,255,0.1)",
                  color: isConnected && depositAmount ? "#000" : "rgba(255,255,255,0.3)",
                  cursor: isConnected && depositAmount ? "pointer" : "not-allowed"
                }}
              >
                {isConnected ? t.deposit : t.connect}
              </button>
            </div>
            
            {/* Withdraw Card */}
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ArrowUpFromLine className="w-5 h-5 text-white/50" />
                {t.withdraw}
              </h3>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-4 mb-3 rounded-lg bg-black/50 border border-white/10 text-xl outline-none focus:border-white/20 transition-colors"
              />
              <div className="flex gap-2 mb-4">
                {["25", "50", "75", "100"].map(pct => (
                  <button
                    key={pct}
                    onClick={() => setWithdrawAmount("0.00")}
                    className="flex-1 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <button
                onClick={() => isConnected && setActiveModal("withdraw")}
                disabled={!isConnected}
                className="w-full py-4 rounded-xl font-semibold bg-white/10 border border-white/10 transition-all hover:bg-white/15"
                style={{
                  opacity: isConnected ? 1 : 0.5,
                  cursor: isConnected ? "pointer" : "not-allowed"
                }}
              >
                {isConnected ? t.withdraw : t.connect}
              </button>
            </div>
          </div>
        </div>
        
        {/* ==================== YIELD LOCK PAGE ==================== */}
        <div style={{ display: activePage === "yield" ? "block" : "none" }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t.yield}</h1>
            <p className="text-white/50">Lock assets for boosted APY rewards</p>
          </div>
          
          {/* Real-Time Yield Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-white/40 text-sm mb-1">{t.lockedBalance}</div>
              <div className="text-2xl font-bold">{yieldLockTotal}</div>
              <div className="text-white/40 text-sm">{selectedAsset}</div>
            </div>
            <div className="p-5 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30">
              <div className="text-[#A855F7]/70 text-sm mb-1">{t.yieldEarned}</div>
              <div 
                className="text-2xl font-bold font-mono tabular-nums"
                style={{ color: pageColors.yield }}
              >
                +{realTimeYieldEarned}
              </div>
              <div className="text-white/40 text-sm">{selectedAsset}</div>
            </div>
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-white/40 text-sm mb-1">{t.apy}</div>
              <div className="text-2xl font-bold" style={{ color: pageColors.yield }}>
                {lockDuration === "1m" ? "5%" : lockDuration === "6m" ? "12%" : "20%"}
              </div>
              <div className="text-white/40 text-sm">
                {lockDuration === "1m" ? `1 ${t.month}` : lockDuration === "6m" ? `6 ${t.months}` : `1 ${t.year}`}
              </div>
            </div>
          </div>
          
          {/* Duration Options */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {(["1m", "6m", "1y"] as const).map((dur) => {
              const opt = lockApyMap[dur]
              const isSelected = lockDuration === dur
              const isBest = dur === "6m"
              return (
                <button
                  key={dur}
                  onClick={() => setLockDuration(dur)}
                  className="p-6 rounded-xl border text-left transition-all relative overflow-hidden"
                  style={{
                    background: isSelected ? `${pageColors.yield}15` : "rgba(255,255,255,0.02)",
                    borderColor: isSelected ? `${pageColors.yield}40` : "rgba(255,255,255,0.1)"
                  }}
                >
                  {isBest && (
                    <div 
                      className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold text-black"
                      style={{ background: pageColors.yield }}
                    >
                      BEST
                    </div>
                  )}
                  <div className="text-lg font-semibold mb-1">{opt.label}</div>
                  <div className="text-3xl font-bold" style={{ color: pageColors.yield }}>{opt.apy}</div>
                  <div className="text-white/40 text-sm">{opt.mult} multiplier</div>
                </button>
              )
            })}
          </div>
          
          {/* Lock Form */}
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
            <div className="mb-4">
              <label className="text-sm text-white/50 block mb-2">{t.amount} to lock</label>
              <input
                type="number"
                value={lockAmount}
                onChange={(e) => setLockAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-4 rounded-lg bg-black/50 border border-white/10 text-xl outline-none focus:border-[#A855F7]/50 transition-colors"
              />
            </div>
            
            {lockAmount && (
              <div className="p-4 rounded-lg bg-[#A855F7]/10 border border-[#A855F7]/20 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/50">Lock Duration</span>
                  <span>{lockApyMap[lockDuration].label}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/50">APY</span>
                  <span style={{ color: pageColors.yield }}>{lockApyMap[lockDuration].apy}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Est. Yield</span>
                  <span className="font-semibold">
                    {(Number(lockAmount) * Number(lockApyMap[lockDuration].apy.replace('%', '')) / 100).toFixed(2)} {selectedAsset}
                  </span>
                </div>
              </div>
            )}
            
            <button
              onClick={() => isConnected && lockAmount && setActiveModal("lock")}
              disabled={!isConnected || !lockAmount}
              className="w-full py-4 rounded-xl font-semibold transition-all"
              style={{
                background: isConnected && lockAmount ? `linear-gradient(to right, ${pageColors.yield}, ${pageColors.vault})` : "rgba(255,255,255,0.1)",
                color: isConnected && lockAmount ? "#fff" : "rgba(255,255,255,0.3)",
                cursor: isConnected && lockAmount ? "pointer" : "not-allowed"
              }}
            >
              {t.lockAssets}
            </button>
          </div>
        </div>
        
        {/* ==================== STREAM PAGE ==================== */}
        <div style={{ display: activePage === "stream" ? "block" : "none" }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t.stream}</h1>
            <p className="text-white/50">Automated recurring payment streams</p>
          </div>
          
          {/* Stream Stats */}
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: t.activeStreams, value: "0" },
              { label: t.totalStreaming, value: "$0.00" },
              { label: t.released, value: "$0.00" },
              { label: t.nextRelease, value: "--" }
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="text-white/40 text-sm mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
          
          {/* Create Stream Form */}
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Repeat className="w-5 h-5" style={{ color: pageColors.stream }} />
              Create New Stream
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-white/50 block mb-2">{t.amount}</label>
                <input
                  type="number"
                  value={streamAmount}
                  onChange={(e) => setStreamAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-4 rounded-lg bg-black/50 border border-white/10 outline-none focus:border-[#10B981]/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-white/50 block mb-2">{t.frequency}</label>
                <select
                  value={streamFrequency}
                  onChange={(e) => setStreamFrequency(e.target.value as "weekly" | "monthly")}
                  className="w-full p-4 rounded-lg bg-black/50 border border-white/10 outline-none focus:border-[#10B981]/50 transition-colors"
                >
                  <option value="weekly">{t.weekly}</option>
                  <option value="monthly">{t.monthly}</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="text-sm text-white/50 block mb-2">{t.recipient}</label>
              <input
                placeholder="0x... (leave empty for self)"
                className="w-full p-4 rounded-lg bg-black/50 border border-white/10 font-mono text-sm outline-none focus:border-[#10B981]/50 transition-colors"
              />
            </div>
            
            {streamAmount && (
              <div className="p-4 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 mb-4 flex items-center gap-3">
                <Info className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="text-white/50">Flow rate: </span>
                  <span className="font-semibold">
                    {(Number(streamAmount) / (streamFrequency === "weekly" ? 7 : 30)).toFixed(4)} {selectedAsset}/day
                  </span>
                </div>
              </div>
            )}
            
            <button
              onClick={() => isConnected && streamAmount && setActiveModal("stream")}
              disabled={!isConnected || !streamAmount}
              className="w-full py-4 rounded-xl font-semibold transition-all"
              style={{
                background: isConnected && streamAmount ? pageColors.stream : "rgba(255,255,255,0.1)",
                color: isConnected && streamAmount ? "#fff" : "rgba(255,255,255,0.3)",
                cursor: isConnected && streamAmount ? "pointer" : "not-allowed"
              }}
            >
              {t.createStream}
            </button>
          </div>
        </div>
        
        {/* ==================== GUARDIAN PAGE ==================== */}
        <div style={{ display: activePage === "guardian" ? "block" : "none" }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t.guardian}</h1>
            <p className="text-white/50">Heritage recovery protection for your assets</p>
          </div>
          
          {/* Warning Banner */}
          <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/20 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-400">{t.notConfigured}</div>
              <div className="text-white/50 text-sm">{t.noProtection}</div>
            </div>
          </div>
          
          {/* Guardian Setup Form */}
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: pageColors.guardian }} />
              Configure Guardian
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-white/50 block mb-2">{t.recoveryAddress}</label>
                <input
                  type="text"
                  value={guardianAddress}
                  onChange={(e) => setGuardianAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full p-4 rounded-lg bg-black/50 border border-white/10 font-mono text-sm outline-none focus:border-[#F59E0B]/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-white/50 block mb-2">{t.inactivityTimer}</label>
                <select
                  value={guardianTimer}
                  onChange={(e) => setGuardianTimer(e.target.value)}
                  className="w-full p-4 rounded-lg bg-black/50 border border-white/10 outline-none focus:border-[#F59E0B]/50 transition-colors"
                >
                  <option value="30">30 {t.days}</option>
                  <option value="90">90 {t.days}</option>
                  <option value="180">180 {t.days}</option>
                  <option value="365">1 {t.year}</option>
                </select>
              </div>
            </div>
            
            {guardianAddress && (
              <div className="p-4 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/50">Recovery Address</span>
                  <span className="font-mono text-xs">{guardianAddress.slice(0, 10)}...{guardianAddress.slice(-8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Inactivity Period</span>
                  <span>{guardianTimer} {t.days}</span>
                </div>
              </div>
            )}
            
            <button
              onClick={() => isConnected && guardianAddress && setActiveModal("guardian")}
              disabled={!isConnected || !guardianAddress}
              className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
              style={{
                background: isConnected && guardianAddress ? `linear-gradient(to right, ${pageColors.guardian}, #EA580C)` : "rgba(255,255,255,0.1)",
                color: isConnected && guardianAddress ? "#000" : "rgba(255,255,255,0.3)",
                cursor: isConnected && guardianAddress ? "pointer" : "not-allowed"
              }}
            >
              <Users className="w-5 h-5" />
              {t.activateGuardian}
            </button>
          </div>
        </div>
      </main>
      
      {/* === MODAL === */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => !isProcessing && setActiveModal(null)}
        >
          <div 
            className="w-full max-w-md bg-[#111] rounded-2xl border border-white/10 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-white/10">
              <h3 className="font-semibold capitalize">{t.confirm} {activeModal}</h3>
              <button 
                onClick={() => setActiveModal(null)} 
                disabled={isProcessing}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              {activeModal === "deposit" && (
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold mb-1">{depositAmount} {selectedAsset}</div>
                  <div className="text-white/50 text-sm">Depositing to Vault</div>
                </div>
              )}
              {activeModal === "withdraw" && (
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold mb-1">{withdrawAmount || "0.00"} {selectedAsset}</div>
                  <div className="text-white/50 text-sm">Withdrawing from Vault</div>
                </div>
              )}
              {activeModal === "lock" && (
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold mb-1">{lockAmount} {selectedAsset}</div>
                  <div className="text-white/50 text-sm">Locking for {lockApyMap[lockDuration].label} at {lockApyMap[lockDuration].apy}</div>
                </div>
              )}
              {activeModal === "stream" && (
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold mb-1">{streamAmount} {selectedAsset}</div>
                  <div className="text-white/50 text-sm">{streamFrequency === "weekly" ? "Weekly" : "Monthly"} stream</div>
                </div>
              )}
              {activeModal === "guardian" && (
                <div className="text-center mb-4">
                  <div className="text-lg font-bold mb-1">Activate Guardian</div>
                  <div className="text-white/50 text-sm font-mono">{guardianAddress.slice(0, 14)}...{guardianAddress.slice(-10)}</div>
                  <div className="text-white/40 text-xs mt-1">{guardianTimer} day inactivity timer</div>
                </div>
              )}
              
              <div 
                className="p-3 rounded-lg text-sm flex justify-between"
                style={{
                  background: `${pageColors[activePage]}10`,
                  border: `1px solid ${pageColors[activePage]}20`
                }}
              >
                <span className="text-white/50">{t.gasEstimate}</span>
                <span style={{ color: pageColors[activePage] }}>~0.001 ARC</span>
              </div>
            </div>
            
            <div className="flex gap-3 p-5 border-t border-white/10">
              <button
                onClick={() => setActiveModal(null)}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 font-medium hover:bg-white/10 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={processTransaction}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: pageColors[activePage],
                  color: "#000"
                }}
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    {t.confirm}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* === TOASTS === */}
      <div className="fixed bottom-20 lg:bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => {
          const colors = {
            success: { bg: "rgba(16,185,129,0.2)", border: "rgba(16,185,129,0.3)" },
            error: { bg: "rgba(239,68,68,0.2)", border: "rgba(239,68,68,0.3)" },
            warning: { bg: "rgba(245,158,11,0.2)", border: "rgba(245,158,11,0.3)" },
            info: { bg: "rgba(0,209,255,0.2)", border: "rgba(0,209,255,0.3)" }
          }
          return (
            <div
              key={toast.id}
              className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm animate-in slide-in-from-right-5"
              style={{
                background: colors[toast.type].bg,
                border: `1px solid ${colors[toast.type].border}`
              }}
            >
              {toast.type === "success" && <Check className="w-4 h-4 text-green-400" />}
              {toast.type === "error" && <X className="w-4 h-4 text-red-400" />}
              {toast.type === "warning" && <AlertCircle className="w-4 h-4 text-amber-400" />}
              {toast.type === "info" && <Info className="w-4 h-4 text-cyan-400" />}
              {toast.message}
            </div>
          )
        })}
      </div>
      
      {/* === PORTFOLIO DRAWER === */}
      <AnimatePresence>
        {isPortfolioOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
              onClick={() => setIsPortfolioOpen(false)}
            />
            
            {/* Glassmorphism Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md overflow-y-auto"
              style={{
                background: "rgba(10, 10, 10, 0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderLeft: "1px solid rgba(245, 158, 11, 0.15)"
              }}
            >
              {/* Drawer Header */}
              <div 
                className="sticky top-0 z-10 p-5 border-b border-amber-500/10"
                style={{
                  background: "rgba(10, 10, 10, 0.9)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)"
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-amber-500">{t.yourPortfolio}</h2>
                  <div className="flex items-center gap-2">
                    {/* Sync Button with rotation animation */}
                    <button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                      {isRefreshing ? t.syncing : t.syncData}
                    </button>
                    <button
                      onClick={disconnectWallet}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                    >
                      {t.disconnect}
                    </button>
                    <button
                      onClick={() => setIsPortfolioOpen(false)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Full Address with Copy */}
                <div 
                  className="flex items-center gap-2 p-3 rounded-xl border border-amber-500/10"
                  style={{ background: "rgba(0, 0, 0, 0.4)" }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/40 mb-0.5">{t.connectedWallet}</div>
                    <div className="font-mono text-sm truncate">{walletAddress}</div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(walletAddress)
                      addToast("success", t.addressCopied)
                    }}
                    className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                {/* Wallet Balance Section */}
                <div 
                  className="p-5 rounded-xl border border-amber-500/20"
                  style={{ background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(180, 83, 9, 0.05) 100%)" }}
                >
                  <div className="text-sm text-amber-500/70 mb-1">{t.walletBalance}</div>
                  <div className="text-4xl font-bold text-amber-500">{arcBalance}</div>
                  <div className="text-white/40 text-sm">ARC</div>
                </div>
                
                {/* Vault Status */}
                <div 
                  className="p-5 rounded-xl border border-white/10"
                  style={{ background: "rgba(255, 255, 255, 0.02)" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-[#00D1FF]" />
                    <span className="font-semibold">{t.vaultStatus}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-white/40 mb-1">{t.activeDeposit}</div>
                      <div className="text-2xl font-bold">{vaultBalance}</div>
                      <div className="text-white/40 text-sm">{selectedAsset}</div>
                    </div>
                    <button
                      onClick={() => { setIsPortfolioOpen(false); setActivePage("vault") }}
                      className="flex items-center gap-1 text-xs text-[#00D1FF] hover:underline"
                    >
                      {t.view} <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                {/* Yield Lock Status */}
                <div 
                  className="p-5 rounded-xl border border-white/10"
                  style={{ background: "rgba(255, 255, 255, 0.02)" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-[#A855F7]" />
                    <span className="font-semibold">{t.yieldLockStatus}</span>
                  </div>
                  
                  {/* Countdown Timer */}
                  <div className="mb-3">
                    <div className="text-xs text-white/40 mb-2">{t.unlockDate}</div>
                    <YieldLockCountdown endTime={yieldLockEndTime} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-xs text-white/40 mb-1">{t.lockedBalance}</div>
                      <div className="text-xl font-bold">{yieldLockTotal}</div>
                      <div className="text-white/40 text-sm">{selectedAsset}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/40 mb-1">{t.accumulatedProfit}</div>
                      <div className="text-xl font-bold text-[#A855F7]">+{yieldLockProfit}</div>
                      <div className="text-white/40 text-sm">{selectedAsset}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => { setIsPortfolioOpen(false); setActivePage("yield") }}
                    className="w-full mt-4 flex items-center justify-center gap-1 py-2 rounded-lg text-xs text-[#A855F7] bg-[#A855F7]/10 hover:bg-[#A855F7]/20 transition-colors"
                  >
                    {t.manageLocks} <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                
                {/* Guardian Status */}
                <div 
                  className="p-5 rounded-xl border border-white/10"
                  style={{ background: "rgba(255, 255, 255, 0.02)" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-[#F59E0B]" />
                    <span className="font-semibold">{t.guardianStatus}</span>
                  </div>
                  
                  {guardianConfigured ? (
                    <div>
                      <div className="text-xs text-white/40 mb-1">{t.heritageAddress}</div>
                      <div 
                        className="font-mono text-sm p-3 rounded-lg border border-[#F59E0B]/20 truncate"
                        style={{ background: "rgba(0, 0, 0, 0.4)" }}
                      >
                        {guardianConfigured}
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-xs text-[#10B981]">
                        <Check className="w-4 h-4" />
                        {t.protectionActive}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">{t.notConfigured}</div>
                          <div className="text-xs text-red-400/70">{t.noProtection}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => { setIsPortfolioOpen(false); setActivePage("guardian") }}
                        className="w-full mt-3 flex items-center justify-center gap-1 py-2 rounded-lg text-xs text-[#F59E0B] bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 transition-colors"
                      >
                        {t.configureGuardian} <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Stream Status */}
                <div 
                  className="p-5 rounded-xl border border-white/10"
                  style={{ background: "rgba(255, 255, 255, 0.02)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Repeat className="w-5 h-5 text-[#10B981]" />
                      <span className="font-semibold">{t.streamStatusLabel}</span>
                    </div>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: isStreamActive ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.1)",
                        color: isStreamActive ? "#10B981" : "rgba(255,255,255,0.5)"
                      }}
                    >
                      {isStreamActive ? t.active : t.inactive}
                    </span>
                  </div>
                  
                  {isStreamActive ? (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/40">{t.progress}</span>
                        <span>{streamProgress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-black/50 overflow-hidden">
                        <motion.div 
                          className="h-full bg-[#10B981]"
                          initial={{ width: 0 }}
                          animate={{ width: `${streamProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-white/40 mt-2">
                        <span>{t.released}: {streamReleased} {selectedAsset}</span>
                        <span>{t.remaining}: --</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-white/40 text-sm mb-3">{t.noActiveStreams}</div>
                      <button
                        onClick={() => { setIsPortfolioOpen(false); setActivePage("stream") }}
                        className="flex items-center justify-center gap-1 mx-auto px-4 py-2 rounded-lg text-xs text-[#10B981] bg-[#10B981]/10 hover:bg-[#10B981]/20 transition-colors"
                      >
                        {t.createStream} <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// YIELD LOCK COUNTDOWN COMPONENT
// ============================================
function YieldLockCountdown({ endTime }: { endTime: number }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  
  useEffect(() => {
    const calcTime = () => {
      const diff = Math.max(0, endTime - Date.now())
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      })
    }
    
    calcTime()
    const interval = setInterval(calcTime, 1000)
    return () => clearInterval(interval)
  }, [endTime])
  
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-[#A855F7]/10 border border-[#A855F7]/20">
      <Timer className="w-5 h-5 text-[#A855F7]" />
      <div className="flex gap-3 font-mono text-lg">
        <div className="text-center">
          <div className="font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
          <div className="text-[10px] text-white/40">DAYS</div>
        </div>
        <span className="text-white/30">:</span>
        <div className="text-center">
          <div className="font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-[10px] text-white/40">HRS</div>
        </div>
        <span className="text-white/30">:</span>
        <div className="text-center">
          <div className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-[10px] text-white/40">MIN</div>
        </div>
        <span className="text-white/30">:</span>
        <div className="text-center">
          <div className="font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-[10px] text-white/40">SEC</div>
        </div>
      </div>
    </div>
  )
}
