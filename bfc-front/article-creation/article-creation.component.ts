import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

interface UploadResponse {
    path?: string;
    url?: string;
}

declare global {
  interface Window {
    lucide: any;
    lumina: any;
  }
}

/**
 * LUMINA ENGINE - Dynamic Layout Core
 */
const TOOLBOX_ITEMS =[
    { type: 'heading', label: 'Heading', icon: 'heading-1', desc: 'Section titles' },
    { type: 'text', label: 'Rich Text', icon: 'type', desc: 'Standard paragraph' },
    { type: 'media', label: 'Media', icon: 'image', desc: 'Images & illustrations' },
    { type: 'quote', label: 'Blockquote', icon: 'quote', desc: 'Key statements' },
    { type: 'callout', label: 'Callout', icon: 'alert-circle', desc: 'Notes and alerts' },
    { type: 'focus-area', label: 'Focus Area', icon: 'target', desc: 'Key highlight' },
    { type: 'divider', label: 'Divider', icon: 'minus', desc: 'Visual break' },
];

const ASSET_BASE_URL = environment.apiUrl.replace(/\/api$/, '');
const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;

class LuminaBuilder {
    state: any;
    uploadImageFn?: (file: File) => Promise<UploadResponse>;

    constructor() {
        this.state = {
            mode: 'edit',
            metadata: {
                title: 'Building for the Future of Energy',
                subtitle: 'A comprehensive analysis of grid modernization and capital allocation strategies.',
                heroImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80',
                readingTime: '12 min read', date: 'Oct 24, 2023', author: 'Elena Ross',
                summary: 'The shift toward renewable energy requires not just new generation capacity, but a complete reimagining of the distribution network.',
                takeaways:['Grid stability is the primary bottleneck', 'Private capital is increasing 40% YoY'],
                references:['Department of Energy Report 2023', 'Global Infrastructure Index']
            },
            sections:[
                { 
                    id: 's1', title: 'The Paradigm Shift', 
                    blocks:[
                        { id: 'b1', type: 'text', content: 'Modern utilities are facing an unprecedented challenge. Drag a component to my left or right edge to automatically create a column.' },
                    ]
                }
            ]
        };
        // wait for DOM to be ready
        setTimeout(() => this.init(), 50);
    }

    init() {
        this.renderToolbox();
        this.syncInputs();
        this.renderAll();
        this.setupEventListeners();
    }

    // --- RENDERING ---
    renderAll() {
        this.renderSections();
        this.renderSectionList();
        this.renderTOC();
        this.renderArray('takeaways', 'takeaways-list', '•');
        this.renderArray('references', 'references-list', '<i data-lucide="link" class="w-3 h-3 mt-1 text-gray-400"></i>');
        // Check if lucide exists to avoid angular errors immediately if not loaded somehow
        if(window.lucide) window.lucide.createIcons();
    }

    renderToolbox() {
        const container = document.getElementById('toolbox-items');
        if(!container) return;
        container.innerHTML = TOOLBOX_ITEMS.map(item => `
            <div draggable="true" ondragstart="window.lumina.handleDragStart(event, '${item.type}')" 
                 class="group flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all cursor-grab active:cursor-grabbing">
                <div class="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-white flex items-center justify-center transition-colors shadow-sm">
                    <i data-lucide="${item.icon}" class="w-5 h-5 text-gray-600"></i>
                </div>
                <div>
                    <p class="text-sm font-semibold text-gray-700">${item.label}</p>
                    <p class="text-[11px] text-gray-400">${item.desc}</p>
                </div>
            </div>
        `).join('');
    }

    renderSections() {
        const c = document.getElementById('sections-container');
        if(!c) return;
        c.innerHTML = this.state.sections.map((section: any, sIdx: number) => `
            <div class="mb-12">
                <div class="flex items-center gap-2 mb-6 group">
                    <input type="text" value="${section.title}" 
                           oninput="window.lumina.updateSectionTitle(${sIdx}, this.value)"
                           class="text-3xl font-bold editable-field" 
                           ${this.state.mode === 'preview' ? 'disabled' : ''}>
                    ${this.state.mode === 'edit' ? `<button onclick="window.lumina.deleteSection(${sIdx})" class="opacity-0 group-hover:opacity-100 text-red-400"><i data-lucide="trash-2" class="w-4 h-4"></i></button>` : ''}
                </div>
                
                <div class="space-y-4">
                    ${section.blocks.map((block: any) => this.renderBlock(block, sIdx)).join('')}
                    
                    <div class="append-zone editor-only" 
                         ondragover="event.preventDefault(); event.currentTarget.classList.add('drag-over')" 
                         ondragleave="event.currentTarget.classList.remove('drag-over')" 
                         ondrop="window.lumina.handleDropAppend(event, ${sIdx})">
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            ${section.blocks.length === 0 ? 'Drag first component here' : '+ Drop to append to section'}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderBlock(block: any, sIdx: number, parentRowId: any = null, colIdx: any = null): string {
        // If it's a dynamic row container
        if (block.type === 'row') {
            return `
            <div class="flex gap-6 w-full relative group">
                ${this.state.mode === 'edit' ? `<button onclick="window.lumina.deleteBlock('${block.id}')" class="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 text-red-400 p-1 hover:bg-red-50 rounded"><i data-lucide="trash-2" class="w-4 h-4"></i></button>` : ''}
                ${block.columns.map((colBlocks: any, i: number) => `
                    <div class="flex-1 flex flex-col gap-4 min-w-0">
                        ${colBlocks.map((b: any) => this.renderBlock(b, sIdx, block.id, i)).join('')}
                    </div>
                `).join('')}
            </div>`;
        }

        // Standard Blocks
        const isEdit = this.state.mode === 'edit';
        let contentHtml = '';
        switch(block.type) {
            case 'heading': contentHtml = `<h2 class="text-2xl font-bold editable-field" contenteditable="${isEdit}" onblur="window.lumina.updateBlockContent('${block.id}', this.innerText)">${block.content || 'Heading'}</h2>`; break;
            case 'text': contentHtml = `<p class="text-lg leading-relaxed text-gray-700 editable-field" contenteditable="${isEdit}" onblur="window.lumina.updateBlockContent('${block.id}', this.innerText)">${block.content || 'Start writing...'}</p>`; break;
            case 'media': contentHtml = `
            <div class="rounded-2xl overflow-hidden bg-gray-100 relative group/media">
                <img src="${this.resolveAssetUrl(block.content) || 'https://picsum.photos/800/450'}" class="w-full">
                ${isEdit ? `
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity z-10 pointer-events-auto">
                   <div class="bg-white p-2 rounded-lg flex items-center gap-2 max-w-[90%] overflow-hidden">
                       <input type="text" placeholder="Image URL..." class="text-xs p-1 outline-none border-b border-gray-300 w-32 flex-1" value="${block.content && typeof block.content === 'string' && !block.content.startsWith('data:') ? block.content : ''}" onchange="window.lumina.updateBlockContent('${block.id}', this.value); window.lumina.renderAll()">
                       <span class="text-[10px] font-bold text-gray-400">OR</span>
                       <label class="cursor-pointer bg-black text-white px-2 py-1.5 rounded text-xs font-bold hover:bg-gray-800 transition-colors whitespace-nowrap">
                           Upload Local
                           <input type="file" accept="image/*" class="hidden" onchange="window.lumina.handleBlockImageUpload('${block.id}', event)">
                       </label>
                   </div>
                </div>
                ` : ''}
            </div>`; break;
            case 'quote': contentHtml = `<blockquote class="text-2xl font-serif italic border-l-4 border-black pl-6 py-2 editable-field" contenteditable="${isEdit}" onblur="window.lumina.updateBlockContent('${block.id}', this.innerText)">${block.content || 'Enter a powerful quote...'}</blockquote>`; break;
            case 'callout': contentHtml = `<div class="p-5 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 flex gap-4"><i data-lucide="info" class="w-6 h-6 flex-shrink-0"></i><p class="editable-field" contenteditable="${isEdit}" onblur="window.lumina.updateBlockContent('${block.id}', this.innerText)">${block.content || 'Callout message...'}</p></div>`; break;
            case 'divider': contentHtml = `<div class="py-6 flex justify-center"><div class="w-24 h-px bg-gray-200"></div></div>`; break;
            case 'focus-area': contentHtml = `
                <div class="bg-gray-50 rounded-[2.5rem] p-10 flex flex-col">
                    <span class="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">Focus Area</span>
                    <h3 class="text-2xl font-bold mb-4 editable-field" contenteditable="${isEdit}" onblur="window.lumina.updateBlockContent('${block.id}', this.innerText)">${block.content || 'Focus Title'}</h3>
                </div>`; break;
        }

        return `
            <div class="block-item group" 
                 ondragover="window.lumina.handleDragOver(event)" 
                 ondragleave="window.lumina.handleDragLeave(event)" 
                 ondrop="window.lumina.handleDropBlock(event, ${sIdx}, '${block.id}', ${parentRowId ? `'${parentRowId}'` : 'null'}, ${colIdx})">
                ${this.state.mode === 'edit' && !parentRowId ? `
                    <button onclick="window.lumina.deleteBlock('${block.id}')" class="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 text-red-400 p-1 hover:bg-red-50 rounded"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                ` : ''}
                ${this.state.mode === 'edit' && parentRowId ? `
                    <button onclick="window.lumina.deleteBlock('${block.id}')" class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-red-400 p-1 bg-white shadow-sm border rounded-md hover:bg-red-50 z-10"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
                ` : ''}
                ${contentHtml}
            </div>
        `;
    }

    // --- DYNAMIC DRAG & DROP LOGIC ---
    handleDragStart(e: any, type: string) { e.dataTransfer.setData('blockType', type); }

    handleDragOver(e: any) {
        e.preventDefault(); e.stopPropagation();
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        
        el.classList.remove('drop-top', 'drop-bottom', 'drop-left', 'drop-right');
        
        // Dynamic Quadrant Detection
        if (x < rect.width * 0.25) el.classList.add('drop-left');
        else if (x > rect.width * 0.75) el.classList.add('drop-right');
        else if (y < rect.height * 0.5) el.classList.add('drop-top');
        else el.classList.add('drop-bottom');
    }

    handleDragLeave(e: any) {
        e.currentTarget.classList.remove('drop-top', 'drop-bottom', 'drop-left', 'drop-right');
    }

    handleDropAppend(e: any, sIdx: number) {
        e.preventDefault(); e.currentTarget.classList.remove('drag-over');
        const type = e.dataTransfer.getData('blockType');
        if(type) {
            this.state.sections[sIdx].blocks.push({ id: 'b' + Date.now(), type, content: '' });
            this.renderAll();
        }
    }

    handleDropBlock(e: any, sIdx: number, targetId: string, parentRowId: any, colIdx: any) {
        e.preventDefault(); e.stopPropagation();
        const el = e.currentTarget;
        const pos = el.classList.contains('drop-top') ? 'top' : el.classList.contains('drop-bottom') ? 'bottom' : el.classList.contains('drop-left') ? 'left' : 'right';
        el.classList.remove('drop-top', 'drop-bottom', 'drop-left', 'drop-right');

        const type = e.dataTransfer.getData('blockType');
        if(!type) return;

        const newBlock = { id: 'b' + Date.now(), type, content: '' };
        const section = this.state.sections[sIdx];

        if (parentRowId) {
            // We are dropping inside an existing row
            const rowBlock = section.blocks.find((b: any) => b.id === parentRowId);
            const colArray = rowBlock.columns[colIdx];
            const tIdx = colArray.findIndex((b: any) => b.id === targetId);

            if (pos === 'top') colArray.splice(tIdx, 0, newBlock);
            else if (pos === 'bottom') colArray.splice(tIdx + 1, 0, newBlock);
            else if (pos === 'left') rowBlock.columns.splice(colIdx, 0, [newBlock]); // Create new column to the left
            else if (pos === 'right') rowBlock.columns.splice(colIdx + 1, 0, [newBlock]); // Create new column to the right
        } else {
            // We are dropping on a top-level block
            const tIdx = section.blocks.findIndex((b: any) => b.id === targetId);
            const targetBlock = section.blocks[tIdx];

            if (pos === 'top') section.blocks.splice(tIdx, 0, newBlock);
            else if (pos === 'bottom') section.blocks.splice(tIdx + 1, 0, newBlock);
            else if (pos === 'left') {
                // Dynamically wrap in a Row block
                section.blocks.splice(tIdx, 1, { id: 'row' + Date.now(), type: 'row', columns: [[newBlock], [targetBlock]] });
            } else if (pos === 'right') {
                // Dynamically wrap in a Row block
                section.blocks.splice(tIdx, 1, { id: 'row' + Date.now(), type: 'row', columns: [[targetBlock], [newBlock]] });
            }
        }
        this.renderAll();
    }

    deleteBlock(id: string) {
        this.state.sections.forEach((s: any) => {
            // Check top level
            const tIdx = s.blocks.findIndex((b: any) => b.id === id);
            if (tIdx > -1) { s.blocks.splice(tIdx, 1); return; }

            // Check inside rows
            s.blocks.forEach((b: any, bIdx: number) => {
                if (b.type === 'row') {
                    b.columns.forEach((col: any) => {
                        const cIdx = col.findIndex((x: any) => x.id === id);
                        if (cIdx > -1) col.splice(cIdx, 1);
                    });
                    
                    // Auto-cleanup empty columns
                    b.columns = b.columns.filter((col: any) => col.length > 0);
                    
                    // Unwrap if only 1 column left
                    if (b.columns.length === 1) {
                        s.blocks.splice(bIdx, 1, ...b.columns[0]);
                    } else if (b.columns.length === 0) {
                        s.blocks.splice(bIdx, 1);
                    }
                }
            });
        });
        this.renderAll();
    }

    // --- UI, SIDEBARS & META ---
    setMode(mode: string) {
        this.state.mode = mode;
        const appBody = document.getElementById('app-body');
        if(appBody) appBody.className = `${mode}-mode`;
        
        const btnEdit = document.getElementById('mode-edit');
        const btnPrev = document.getElementById('mode-preview');
        
        if (mode === 'preview') {
            if(btnPrev) { btnPrev.classList.add('bg-white', 'shadow-sm', 'text-black'); btnPrev.classList.remove('text-gray-500'); }
            if(btnEdit) { btnEdit.classList.remove('bg-white', 'shadow-sm', 'text-black'); btnEdit.classList.add('text-gray-500'); }
        } else {
            if(btnEdit) { btnEdit.classList.add('bg-white', 'shadow-sm', 'text-black'); btnEdit.classList.remove('text-gray-500'); }
            if(btnPrev) { btnPrev.classList.remove('bg-white', 'shadow-sm', 'text-black'); btnPrev.classList.add('text-gray-500'); }
        }
        this.renderAll();
    }

    renderSectionList() {
        const el = document.getElementById('section-list');
        if(!el) return;
        el.innerHTML = this.state.sections.map((s: any, i: number) => `
            <div class="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-600">
                <i data-lucide="layers" class="w-4 h-4 text-gray-400 mr-2"></i>
                <span class="text-sm font-medium truncate">${s.title}</span>
            </div>
        `).join('');
    }

    renderTOC() {
        const el = document.getElementById('table-of-contents');
        if(!el) return;
        el.innerHTML = this.state.sections.map((s: any) => `
            <a href="#" class="block text-sm font-semibold text-[#1f6f5c] hover:underline">${s.title}</a>
        `).join('');
    }

    renderArray(key: string, elId: string, iconHtml: string) {
        const el = document.getElementById(elId);
        if(!el) return;
        el.innerHTML = this.state.metadata[key].map((t: any, i: number) => `
            <div class="flex gap-2 group">
                <span class="text-[#1f6f5c] font-bold mt-0.5 flex-shrink-0">${iconHtml}</span>
                <textarea class="text-sm text-gray-600 editable-field flex-1 resize-none" rows="2"
                       oninput="window.lumina.updateArrayItem('${key}', ${i}, this.value)" ${this.state.mode === 'preview' ? 'disabled' : ''}>${t}</textarea>
                ${this.state.mode === 'edit' ? `<button onclick="window.lumina.removeArrayItem('${key}', ${i})" class="opacity-0 group-hover:opacity-100 text-red-400 self-start"><i data-lucide="x" class="w-3 h-3"></i></button>` : ''}
            </div>
        `).join('');
    }

    addSection() { this.state.sections.push({ id: 's' + Date.now(), title: 'New Section', blocks:[] }); this.renderAll(); }
    deleteSection(idx: number) { this.state.sections.splice(idx, 1); this.renderAll(); }
    updateSectionTitle(idx: number, title: string) { this.state.sections[idx].title = title; this.renderTOC(); this.renderSectionList(); }
    updateBlockContent(id: string, text: string) { const b = this.findBlockFlat(id); if (b) b.content = text; }

    resolveAssetUrl(path: any) {
        if (!path || typeof path !== 'string') {
            return '';
        }

        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
            return path;
        }

        if (path.startsWith('/uploads/') || path.startsWith('uploads/')) {
            return `${ASSET_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
        }

        return path;
    }

    findBlockFlat(id: string) {
        for(let s of this.state.sections) {
            for(let b of s.blocks) {
                if(b.id === id) return b;
                if(b.type === 'row') {
                    for(let col of b.columns) {
                        let inner = col.find((x: any) => x.id === id);
                        if(inner) return inner;
                    }
                }
            }
        }
        return null;
    }

    addArrayItem(key: string) { this.state.metadata[key].push('New entry...'); this.renderAll(); }
    updateArrayItem(key: string, index: number, value: string) { this.state.metadata[key][index] = value; }
    removeArrayItem(key: string, index: number) { this.state.metadata[key].splice(index, 1); this.renderAll(); }

    syncInputs() {
        const m = this.state.metadata;
        ['title', 'subtitle', 'time', 'date', 'author', 'summary', 'category'].forEach(k => {
            const el = document.getElementById(`meta-${k}`) as HTMLInputElement | HTMLTextAreaElement;
            if(!el) return;
            el.value = m[k === 'time' ? 'readingTime' : k] || '';
            el.addEventListener('input', (e: any) => this.state.metadata[k === 'time' ? 'readingTime' : k] = e.target.value);
        });
    }

    updateHero(url: string) {
        if(url) {
            this.state.metadata.heroImage = url;
            const img = document.getElementById('hero-image-display') as HTMLImageElement;
            if(img) img.src = this.resolveAssetUrl(url);
        }
    }

    handleBlockImageUpload(id: string, event: any) {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
                alert('Image is too large. Please use a file under 10 MB.');
                return;
            }

            const uploadPromise = this.uploadImageFn?.(file);
            if (!uploadPromise) {
                alert('Upload service is not ready yet. Please wait a second and try again.');
                return;
            }

            uploadPromise.then((response: UploadResponse) => {
                const uploadedPath = response.path || response.url;
                if (!uploadedPath) {
                    throw new Error('Upload succeeded but no file path was returned by backend.');
                }

                this.updateBlockContent(id, uploadedPath);
                this.renderAll();
            }).catch((error: unknown) => {
                console.error('Block image upload failed:', error);
                alert('Block image upload failed. Please retry with a smaller image or check backend logs.');
            });
        }
    }

    setupEventListeners() {
        const scrollNode = document.getElementById('canvas-scroll-node');
        if(!scrollNode) return;
        scrollNode.addEventListener('scroll', () => {
            const top = scrollNode.scrollTop, height = scrollNode.scrollHeight - scrollNode.clientHeight;
            const bar = document.getElementById('scroll-progress-bar');
            if(bar) bar.style.width = (top / height) * 100 + '%';
            const hero = document.getElementById('hero-node');
            if(hero) hero.style.setProperty('--hero-progress', String(Math.min(top / hero.offsetHeight, 1)));
        });
    }
}


@Component({
  selector: 'app-article-creation',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './article-creation.component.html',
  styleUrl: './article-creation.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ArticleCreationComponent implements AfterViewInit {

    constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

    ngAfterViewInit() {
        if (!window.lumina) {
            window.lumina = new LuminaBuilder();
        } else if (window.lumina.init) {
            window.lumina.init();
        }

        window.lumina.uploadImageFn = (file: File) => this.uploadImage(file);

        // inject script for lucide icons
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/lucide@latest';
        script.onload = () => {
            if (window.lucide?.createIcons) {
                window.lucide.createIcons();
            }
        };
        document.body.appendChild(script);

        // add tailwind for the article creation component specifically via CDN so we do not pollute the global css rules with standard tailwind cdn styles.
        // Or if we want to run tailwind, we already have angular tailwind configuration.
        // I will add tailwind via CDN just to ensure all arbitrary classes in the HTML work exactly as the vanilla demo
        const twScript = document.createElement('script');
        twScript.src = 'https://cdn.tailwindcss.com';
        document.body.appendChild(twScript);
        
        // Setup font links
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
    }
    
    callLumina(methodName: string, ...args: any[]) {
      if (window.lumina && typeof window.lumina[methodName] === 'function') {
        window.lumina[methodName](...args);
      }
    }

    uploadImage(file: File): Promise<UploadResponse> {
        if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
            return Promise.reject(new Error('Image is too large. Please use a file under 10 MB.'));
        }

        const formData = new FormData();
        formData.append('file', file);

        return firstValueFrom(
            this.http.post<UploadResponse>(`${environment.apiUrl}/uploads/image`, formData)
        );
    }
    
    onHeroImageUpload(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
                alert('Image is too large. Please use a file under 10 MB.');
                return;
            }

            this.uploadImage(file).then((response: UploadResponse) => {
                const uploadedPath = response.path || response.url;
                if (!uploadedPath) {
                    throw new Error('Upload succeeded but no file path was returned by backend.');
                }

                this.callLumina('updateHero', uploadedPath);
                this.callLumina('renderAll');
            }).catch((error: unknown) => {
                console.error('Hero image upload failed:', error);
                if (error instanceof HttpErrorResponse) {
                    const backendMessage = typeof error.error === 'string'
                        ? error.error
                        : error.error?.message;
                    alert(backendMessage || 'Hero image upload failed. Check backend logs.');
                    return;
                }

                alert((error as Error)?.message || 'Hero image upload failed. Check backend logs.');
            });
        }
    }

    saveArticle() {
        const currentUserId = this.authService.getCurrentUserId();
        if (!currentUserId) {
            alert('Please sign in before publishing an article.');
            return;
        }

        const state = window.lumina.state;
        const payload = {
            title: state.metadata.title || 'Untitled',
            description: state.metadata.summary || 'No description',
            userId: currentUserId,
            category: state.metadata.category || 'blog',
            image: state.metadata.heroImage || '',
            content: {
                metadata: state.metadata,
                sections: state.sections,
                takeaways: state.metadata.takeaways || [],
                referenceList: state.metadata.references || []
            }
        };

        console.log('Article payload:', JSON.stringify(payload, null, 2));
    console.log('Manual SQL INSERT preview:', `INSERT INTO articles (title, description, content, user_id, category, likes, image, created_at, updated_at) VALUES ('${(payload.title || '').replace(/'/g, "''")}', '${(payload.description || '').replace(/'/g, "''")}', '${JSON.stringify(payload.content).replace(/'/g, "''")}', ${payload.userId}, ${payload.category ? `'${payload.category.replace(/'/g, "''")}'` : 'NULL'}, 0, ${payload.image ? `'${payload.image.replace(/'/g, "''")}'` : 'NULL'}, NOW(), NOW());`);

        this.http.post(`${environment.apiUrl}/articles/create`, payload).subscribe({
            next: (res) => {
                alert('Article saved successfully!');
                console.log('Saved:', res);
                this.router.navigate(['/admin/articles']);
            },
            error: (err) => {
                alert('Error saving article. Check console.');
                console.error(err);
            }
        });
    }
}
