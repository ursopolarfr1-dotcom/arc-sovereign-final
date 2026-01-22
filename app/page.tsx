"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { 
  Shield, Lock, Repeat, Users, Wallet, Globe, Zap,
  ChevronDown, X, Loader2, ExternalLink,
  ArrowDownToLine, ArrowUpFromLine, AlertCircle, Check, Info
} from "lucide-react"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants"

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
    year: "Year"
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
    year: "Ano"
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
    year: "Ano"
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
    year: "An"
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
// MAIN COMPONENT
// ============================================
export default function ArcSovereign() {
  // ===== PAGE STATE =====
  const [activePage, setActivePage] = useState<Page>("vault")
  const [language, setLanguage] = useState<Language>("EN")
  const [selectedAsset, setSelectedAsset] = useState<"USDC" | "EURC">("USDC")
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // ===== WALLET STATE =====
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  
  // ===== DATA STATE =====
  const [balances, setBalances] = useState({ ARC: "10.00", USDC: "1000.00", EURC: "500.00" })
  const [vaultBalance, setVaultBalance] = useState("0.00")
  const [yieldDisplay, setYieldDisplay] = useState("0.00000000")
  
  // ===== FORM STATE =====
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [lockAmount, setLockAmount] = useState("")
  const [lockDuration, setLockDuration] = useState<"1m" | "6m" | "1y">("6m")
  const [streamAmount, setStreamAmount] = useState("")
  const [streamFrequency, setStreamFrequency] = useState<"weekly" | "monthly">("weekly")
  const [guardianAddress, setGuardianAddress] = useState("")
  const [guardianTimer, setGuardianTimer] = useState("90")
  
  // ===== UI STATE =====
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  
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
  
  // ===== UPDATE VAULT BALANCE =====
  const updateVaultBalance = useCallback(async () => {
    if (!contract || !walletAddress) return
    
    try {
      const balance = await contract.balanceOf(walletAddress)
      const balanceFormatted = ethers.utils.formatEther(balance)
      setVaultBalance(parseFloat(balanceFormatted).toFixed(2))
    } catch (error) {
      console.error("Error fetching vault balance:", error)
    }
  }, [contract, walletAddress])

  // ===== CONNECT WALLET (stable) =====
  const connectWallet = useCallback(async () => {
    if (isConnecting) return
    
    // Check if we're on the client side and component is mounted
    if (typeof window === 'undefined' || !isMounted || typeof window.ethereum === 'undefined') {
      addToast("error", t.installWallet)
      return
    }
    
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
        
        // Create ethers provider and contract
        const web3Provider = new ethers.providers.Web3Provider(ethereum)
        const signer = web3Provider.getSigner()
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        
        setProvider(web3Provider)
        setContract(contractInstance)
        
        // Update vault balance
        const balance = await contractInstance.balanceOf(accounts[0])
        const balanceFormatted = ethers.utils.formatEther(balance)
        setVaultBalance(parseFloat(balanceFormatted).toFixed(2))
        
        addToast("success", t.connected)
        
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
    } catch (error) {
      console.error("Connection error:", error)
      addToast("error", "Connection failed")
    }
    setIsConnecting(false)
  }, [isConnecting, isMounted, addToast, t])
  
  const disconnectWallet = useCallback(() => {
    setIsConnected(false)
    setWalletAddress("")
    setProvider(null)
    setContract(null)
    setVaultBalance("0.00")
    localStorage.removeItem("arc_wallet_address")
    addToast("info", t.disconnected)
  }, [addToast, t])

  // ===== HANDLE DEPOSIT =====
  const handleDeposit = useCallback(async (amount: string) => {
    if (!contract || !amount) return
    
    try {
      setIsProcessing(true)
      const amountWei = ethers.utils.parseEther(amount)
      const tx = await contract.deposit({ value: amountWei })
      addToast("info", "Transaction sent, waiting for confirmation...")
      
      await tx.wait()
      
      // Update balance after successful deposit
      await updateVaultBalance()
      
      setIsProcessing(false)
      setActiveModal(null)
      setDepositAmount("")
      addToast("success", t.txComplete)
    } catch (error: any) {
      console.error("Deposit error:", error)
      setIsProcessing(false)
      addToast("error", error?.message || "Deposit failed")
    }
  }, [contract, addToast, t, updateVaultBalance])

  // ===== HANDLE WITHDRAW =====
  const handleWithdraw = useCallback(async (amount: string) => {
    if (!contract || !amount) return
    
    try {
      setIsProcessing(true)
      const amountWei = ethers.utils.parseEther(amount)
      const tx = await contract.withdraw(amountWei)
      addToast("info", "Transaction sent, waiting for confirmation...")
      
      await tx.wait()
      
      // Update balance after successful withdraw
      await updateVaultBalance()
      
      setIsProcessing(false)
      setActiveModal(null)
      setWithdrawAmount("")
      addToast("success", t.txComplete)
    } catch (error: any) {
      console.error("Withdraw error:", error)
      setIsProcessing(false)
      addToast("error", error?.message || "Withdraw failed")
    }
  }, [contract, addToast, t, updateVaultBalance])
  
  // ===== SET MOUNTED STATE (Client-side only) =====
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // ===== SINGLE useEffect - RUNS ONCE (Client-side only) =====
  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined' || !isMounted) return
    
    // Prevent double-run in strict mode
    if (mountedRef.current) return
    mountedRef.current = true
    
    // 1. Start yield ticker
    intervalRef.current = setInterval(() => {
      yieldRef.current += 0.00000001 + Math.random() * 0.00000001
      setYieldDisplay(yieldRef.current.toFixed(8))
    }, 100)
    
    // 2. Check existing wallet connection
    const ethereum = (window as Window & { ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<string[] | string>
      on: (event: string, handler: (data: unknown) => void) => void
      removeListener: (event: string, handler: (data: unknown) => void) => void
    }}).ethereum
    
    if (typeof window.ethereum !== 'undefined' && ethereum) {
      // Check saved connection (only on client)
      const savedAddress = typeof window !== 'undefined' ? localStorage.getItem("arc_wallet_address") : null
      
      ethereum.request({ method: "eth_accounts" })
        .then(async accounts => {
          const accs = accounts as string[]
          if (accs[0]) {
            // If saved address matches, restore connection
            if (!savedAddress || accs[0].toLowerCase() === savedAddress.toLowerCase()) {
              setWalletAddress(accs[0])
              setIsConnected(true)
              localStorage.setItem("arc_wallet_address", accs[0])
              
              // Create ethers provider and contract
              const web3Provider = new ethers.providers.Web3Provider(ethereum)
              const signer = web3Provider.getSigner()
              const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
              
              setProvider(web3Provider)
              setContract(contractInstance)
              
              // Update vault balance
              try {
                const balance = await contractInstance.balanceOf(accs[0])
                const balanceFormatted = ethers.utils.formatEther(balance)
                setVaultBalance(parseFloat(balanceFormatted).toFixed(2))
              } catch (error) {
                console.error("Error fetching initial balance:", error)
              }
            }
          }
        })
        .catch(() => {})
      
      // 3. Listen for account changes
      const handleAccounts = async (data: unknown) => {
        const accounts = data as string[]
        if (accounts[0]) {
          setWalletAddress(accounts[0])
          setIsConnected(true)
          localStorage.setItem("arc_wallet_address", accounts[0])
          
          // Update provider and contract for new account
          try {
            const web3Provider = new ethers.providers.Web3Provider(ethereum)
            const signer = web3Provider.getSigner()
            const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
            
            setProvider(web3Provider)
            setContract(contractInstance)
            
            // Update vault balance
            const balance = await contractInstance.balanceOf(accounts[0])
            const balanceFormatted = ethers.utils.formatEther(balance)
            setVaultBalance(parseFloat(balanceFormatted).toFixed(2))
          } catch (error) {
            console.error("Error updating account:", error)
          }
        } else {
          setWalletAddress("")
          setIsConnected(false)
          setProvider(null)
          setContract(null)
          setVaultBalance("0.00")
          localStorage.removeItem("arc_wallet_address")
        }
      }
      
      ethereum.on("accountsChanged", handleAccounts)
    }
    
    // Cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isMounted]) // Run when component is mounted on client
  
  // ===== PROCESS TRANSACTION =====
  const processTransaction = useCallback(async () => {
    if (activeModal === "deposit" && depositAmount) {
      await handleDeposit(depositAmount)
    } else if (activeModal === "withdraw" && withdrawAmount) {
      await handleWithdraw(withdrawAmount)
    } else {
      // Fallback for other modals (lock, stream, guardian)
      setIsProcessing(true)
      await new Promise(r => setTimeout(r, 2000))
      setIsProcessing(false)
      setActiveModal(null)
      addToast("success", t.txComplete)
      
      // Reset form fields
      setLockAmount("")
      setStreamAmount("")
      setGuardianAddress("")
    }
  }, [activeModal, depositAmount, withdrawAmount, handleDeposit, handleWithdraw, addToast, t])

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
            
            {/* Connect Button */}
            <button
              onClick={isConnected ? disconnectWallet : connectWallet}
              disabled={isConnecting || !isMounted}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: isConnected ? "rgba(255,255,255,0.05)" : (isMounted ? pageColors[activePage] : "rgba(255,255,255,0.1)"),
                color: isConnected ? "#fff" : "#000"
              }}
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4" />
              )}
              <span>
                {isMounted && isConnected && walletAddress && walletAddress.length >= 10
                  ? `${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}` 
                  : t.connect}
              </span>
            </button>
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
              <div><span className="text-white/40">ARC:</span> <span className="font-semibold">{balances.ARC}</span></div>
              <div><span className="text-white/40">USDC:</span> <span className="font-semibold">{balances.USDC}</span></div>
              <div><span className="text-white/40">EURC:</span> <span className="font-semibold">{balances.EURC}</span></div>
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
              <div className="text-2xl font-bold">{balances[selectedAsset]} <span className="text-base text-white/50">{selectedAsset}</span></div>
            </div>
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-white/40 text-sm mb-1">{t.deposited}</div>
              <div className="text-2xl font-bold">{vaultBalance} <span className="text-base text-white/50">ARC</span></div>
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
                    onClick={() => setDepositAmount((Number(balances[selectedAsset]) * Number(pct) / 100).toFixed(2))}
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
                <Info className="w-5 h-5 text-[#10B981] flex-shrink-0" />
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
            
            {guardianAddress && guardianAddress.length >= 18 && (
              <div className="p-4 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/50">Recovery Address</span>
                  <span className="font-mono text-xs">
                    {guardianAddress.length >= 18
                      ? `${guardianAddress.slice(0, 10)}...${guardianAddress.slice(-8)}`
                      : guardianAddress}
                  </span>
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
                  <div className="text-white/50 text-sm font-mono">
                    {guardianAddress && guardianAddress.length >= 24
                      ? `${guardianAddress.slice(0, 14)}...${guardianAddress.slice(-10)}`
                      : guardianAddress || "0x..."}
                  </div>
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
    </div>
  )
}
